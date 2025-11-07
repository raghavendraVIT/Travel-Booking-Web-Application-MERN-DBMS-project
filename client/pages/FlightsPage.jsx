/*
//with source,destination,date
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './FlightPage.css'; // Import the custom CSS file

const FlightsPage = () => {
    const { isAuthenticated } = useAuth();
    const [flights, setFlights] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Dummy flight data for testing
    const dummyFlights = [
        {
            _id: '1',
            airline: 'Air India',
            source: 'New York',
            destination: 'Los Angeles',
            date: '2025-11-15T12:00:00',
            duration: '6h 10m',
            price: 15000,
        },
        {
            _id: '2',
            airline: 'Emirates',
            source: 'London',
            destination: 'Dubai',
            date: '2025-11-20T14:00:00',
            duration: '7h 30m',
            price: 21000,
        },
        {
            _id: '3',
            airline: 'Lufthansa',
            source: 'Berlin',
            destination: 'New York',
            date: '2025-12-01T08:00:00',
            duration: '9h 5m',
            price: 18000,
        },
        {
            _id: '4',
            airline: 'Lufthansa',
            source: 'Berlin',
            destination: 'New York',
            date: '2025-11-01T08:00:00',
            duration: '9h 5m',
            price: 18000,
        },
    ];

    // Simulate API response with dummy data
    const fetchFlights = () => {
        setLoading(true);
        setTimeout(() => {
            // Filter flights based on source, destination, and date
            const filteredFlights = dummyFlights.filter(flight =>
                flight.source.toLowerCase().includes(source.toLowerCase()) &&
                flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
                (date ? new Date(flight.date).toLocaleDateString() === new Date(date).toLocaleDateString() : true)
            );
            setFlights(filteredFlights);
            setLoading(false);
            if (filteredFlights.length === 0) {
                setMessage('No flights found matching your search criteria.');
            } else {
                setMessage('');
            }
        }, 1000); // Simulate network delay
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFlights();
    };

    const handleBook = async (flightId, price) => {
        if (!isAuthenticated) {
            alert('Please login to book a flight.');
            return;
        }

        try {
            // Simulate successful booking
            alert(`Flight ${flightId} booked successfully for ₹${price.toLocaleString()}`);
            setMessage('Flight successfully booked! Check My Bookings.');
            // Clear message after a delay
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Booking failed:', error);
            setMessage('Booking failed. Please try again.');
        }
    };

    useEffect(() => {
        fetchFlights(); // Load flights on initial render (optional)
    }, []); 

    return (
        <div className="homepage-container">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">✈️ Book Your Flight</h1>

            
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Source City"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Destination City"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field"
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="btn-primary">
                    Search Flights
                </button>
            </form>

            
            {loading ? (
                <div className="loading">Loading flights...</div>
            ) : message ? (
                <div className="message">{message}</div>
            ) : (
                <div className="flight-results">
                    {flights.map(flight => (
                        <div key={flight._id} className="flight-card">
                            <div className="flight-info">
                                <h3 className="flight-airline">{flight.airline}</h3>
                                <p className="flight-date">{new Date(flight.date).toLocaleDateString()} | {flight.duration}</p>
                                <p className="flight-route">{flight.source} &rarr; {flight.destination}</p>
                            </div>
                            <div className="price-section">
                                <p className="flight-price">₹{flight.price.toLocaleString()}</p>
                                <button
                                    onClick={() => handleBook(flight._id, flight.price)}
                                    className="btn-primary"
                                >
                                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightsPage;
*/

import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './FlightPage.css';

const FlightsPage = () => {
    const { isAuthenticated } = useAuth();
    const [flights, setFlights] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);

    const fetchFlights = async () => {
        setLoading(true);
        setMessage('');
        setSearchClicked(true);
        try {
            const params = {};
            if (source) params.source = source;
            if (destination) params.destination = destination;
            if (date) params.date = date;

            const { data } = await api.get('/flights', { params });

            if (data.length === 0) {
                setMessage('No flights found for the selected route and date.');
            }
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setMessage('Error loading flights. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFlights();
    };

    const handleBook = async (flightId, price) => {
        if (!isAuthenticated) {
            alert('Please login to book a flight.');
            return;
        }

        try {
            const response = await api.post('/bookings', {
                itemId: flightId,
                itemType: 'Flight'
            });

            if (response.status === 201) {
                alert(`✅ Flight booked successfully for ₹${price.toLocaleString()}`);
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error booking flight:', error);
            alert('Error booking flight. Please try again later.');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="homepage-container">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">✈️ Book Your Flight</h1>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Source City"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="text"
                    placeholder="Destination City"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="btn-primary">
                    Search Flights
                </button>
            </form>

            {!searchClicked ? null : loading ? (
                <div className="loading">Loading flights...</div>
            ) : message ? (
                <div className="message">{message}</div>
            ) : (
                <div className="flight-results">
                    {flights.map((flight) => (
                        <div key={flight._id} className="flight-card">
                            <div className="flight-info">
                                <h3 className="flight-airline">{flight.airline}</h3>

                                <p className="flight-date">
                                    {new Date(flight.date).toLocaleDateString()} | 🕒{' '}
                                    {formatTime(flight.date)}
                                </p>

                                <p className="flight-route">
                                    {flight.source} → {flight.destination}
                                </p>

                                {flight.duration && (
                                    <p className="flight-duration">⏱ Duration: {flight.duration}</p>
                                )}
                            </div>

                            <div className="price-section">
                                <p className="flight-price">₹{flight.price.toLocaleString()}</p>
                                <button
                                    onClick={() => handleBook(flight._id, flight.price)}
                                    className="btn-primary"
                                >
                                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightsPage;
