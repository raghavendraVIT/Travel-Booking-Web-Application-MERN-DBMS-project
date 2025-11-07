import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/bookings`);
            setBookings(data.sort((a, b) => (a.status === 'Confirmed' ? -1 : 1)));
            setLoading(false);
            if (data.length === 0) {
                setMessage('You have no current bookings.');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setMessage('Failed to load your bookings.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleCancel = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.delete(`/bookings/${bookingId}`);
                setMessage('Booking successfully cancelled!');
                fetchBookings();
            } catch (error) {
                console.error('Cancellation failed:', error);
                setMessage('Cancellation failed. Please try again.');
            }
        }
    };

    if (loading) return <div className="loading-message">Loading your bookings...</div>;
    if (!user) return <div className="error-message">Please log in to view your bookings.</div>;

    return (
        <div className="bookings-container">
            <h1 className="bookings-header">📘 My Bookings ({bookings.length})</h1>
            
            {message && <div className="message-box">{message}</div>}

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p className="no-bookings-text">You currently have no flight or hotel bookings.</p>
                    <p className="explore-link">Start exploring now!</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <BookingCard 
                            key={booking._id} 
                            booking={booking} 
                            onCancel={handleCancel} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
