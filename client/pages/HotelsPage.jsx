/*
//WITH UI (DUMMY HOTELS USED)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './HotelPage.css';

const HotelsPage = () => {
    const { isAuthenticated } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Dummy hotel data to simulate a real API response
    const dummyHotels = [
        {
            _id: '1',
            name: 'Grand Hyatt Mumbai',
            city: 'Mumbai',
            price: 8500,
            description: 'A luxurious hotel located in the heart of Mumbai.',
            images: ['https://via.placeholder.com/600x400.png?text=Grand+Hyatt+Mumbai']
        },
        {
            _id: '2',
            name: 'Taj Palace New Delhi',
            city: 'New Delhi',
            price: 12000,
            description: 'A 5-star hotel with world-class amenities.',
            images: ['https://via.placeholder.com/600x400.png?text=Taj+Palace+New+Delhi']
        },
        {
            _id: '3',
            name: 'The Leela Palace Bangalore',
            city: 'Bangalore',
            price: 9500,
            description: 'An iconic luxury hotel located in the heart of Bangalore.',
            images: ['https://via.placeholder.com/600x400.png?text=The+Leela+Palace+Bangalore']
        },
        {
            _id: '4',
            name: 'ITC Grand Chola Chennai',
            city: 'Chennai',
            price: 7800,
            description: 'A beautiful hotel blending modern luxury with traditional hospitality.',
            images: ['https://via.placeholder.com/600x400.png?text=ITC+Grand+Chola+Chennai']
        },
        {
            _id: '5',
            name: 'The Oberoi Udaivilas',
            city: 'Udaipur',
            price: 15000,
            description: 'An award-winning hotel with scenic lake views.',
            images: ['https://via.placeholder.com/600x400.png?text=The+Oberoi+Udaivilas']
        }
    ];

    // Simulate loading process
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setHotels(dummyHotels);
            setLoading(false);
        }, 1000); // Simulate API loading time
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!city.trim()) {
            setMessage('Please enter a city to search for hotels.');
        } else {
            setHotels(dummyHotels.filter(hotel => hotel.city.toLowerCase().includes(city.toLowerCase())));
            setMessage('');
        }
    };

    const handleBook = async (hotelId, price) => {
        if (!isAuthenticated) {
            alert('Please login to book a hotel.');
            return;
        }

        try {
            // Simulate booking
            alert(`Hotel ${hotelId} booked for ₹${price}`);
            setMessage('Hotel successfully booked! Check My Bookings.');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Booking failed:', error);
            setMessage('Booking failed. Please try again.');
        }
    };

    return (
        <div className="hotels-container">
            <h1 className="page-title">🏨 Find Your Perfect Stay</h1>
            
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search by City (e.g., London, Mumbai)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search Hotels
                </button>
            </form>

            {loading ? (
                <div className="loading">Loading hotels...</div>
            ) : message ? (
                <div className="message">{message}</div>
            ) : (
                <div className="hotel-cards">
                    {hotels.length === 0 ? (
                        <div className="message">No hotels found in this city.</div>
                    ) : (
                        hotels.map(hotel => (
                            <div key={hotel._id} className="hotel-card">
                                <img 
                                    src={hotel.images[0]} 
                                    alt={hotel.name} 
                                    className="hotel-image"
                                />
                                <div className="hotel-info">
                                    <h3 className="hotel-name">{hotel.name}</h3>
                                    <p className="hotel-city">{hotel.city}</p>
                                    <p className="hotel-price">₹{hotel.price.toLocaleString()} / night</p>
                                    <p className="hotel-description">{hotel.description}</p>
                                    <button 
                                        onClick={() => handleBook(hotel._id, hotel.price)}
                                        className="book-button"
                                        disabled={!isAuthenticated}
                                    >
                                        {isAuthenticated ? 'Book Now' : 'Login to Book'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HotelsPage;
*/

//with actual database connectivity
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './HotelPage.css';

const HotelsPage = () => {
    const { isAuthenticated } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [city, setCity] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);

    const fetchHotels = async () => {
        setLoading(true);
        setMessage('');
        setSearchClicked(true);

        try {
            const params = {};
            if (city) params.city = city;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (minRating) params.minRating = minRating;

            const { data } = await api.get('/hotels', { params });
            if (data.length === 0) {
                setMessage('No hotels found for the given filters.');
            }
            setHotels(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setMessage('Error loading hotels. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!city.trim() && !minPrice && !maxPrice && !minRating) {
            setMessage('Please enter at least one filter to search.');
            return;
        }
        fetchHotels();
    };

    const handleBook = async (hotelId, price) => {
        if (!isAuthenticated) {
            alert('Please login to book a hotel.');
            return;
        }

        try {
            await api.post('/bookings', {
                itemType: 'Hotel',
                itemId: hotelId,
                totalAmount: price,
            });

            alert('✅ Hotel booked successfully!');
            setMessage('Hotel successfully booked! Check My Bookings.');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Booking failed:', error);
            setMessage('Booking failed. Please try again.');
        }
    };

    return (
        <div className="hotels-container">
            <h1 className="page-title">🏨 Find Your Perfect Stay</h1>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="City (e.g., Mumbai)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="search-input"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="search-input"
                />
                <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="search-input"
                >
                    <option value="">Min Rating</option>
                    <option value="1">⭐ 1+</option>
                    <option value="2">⭐ 2+</option>
                    <option value="3">⭐ 3+</option>
                    <option value="4">⭐ 4+</option>
                    <option value="5">⭐ 5</option>
                </select>
                <button type="submit" className="search-button">
                    Search Hotels
                </button>
            </form>

            {!searchClicked ? null : loading ? (
                <div className="loading">Loading hotels...</div>
            ) : message ? (
                <div className="message">{message}</div>
            ) : (
                <div className="hotel-cards">
                    {hotels.map((hotel) => (
                        <div key={hotel._id} className="hotel-card">
                            <img
                                src={
                                    hotel.images?.[0]
                                    ? `http://localhost:5000${hotel.images[0]}`
                                    : 'https://via.placeholder.com/600x400.png?text=Hotel'
                                }
                            alt={hotel.name}
                            className="hotel-image"
                            />

                            <div className="hotel-info">
                                <h3 className="hotel-name">{hotel.name}</h3>
                                <p className="hotel-city">{hotel.city}</p>
                                <p className="hotel-rating">⭐ {hotel.rating?.toFixed(1) || 'N/A'}</p>
                                <p className="hotel-price">₹{hotel.price.toLocaleString()} / night</p>
                                {hotel.description && (
                                    <p className="hotel-description">{hotel.description}</p>
                                )}
                                <button
                                    onClick={() => handleBook(hotel._id, hotel.price)}
                                    className="book-button"
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

export default HotelsPage;


/*
{
  "name": "Delhi Sultan Palace",
  "city": "Delhi",
  "price": 13000,
  "rating": 4.2,
  "description": "Majestic luxury blending heritage and modern amenities.",
  "images": ["/uploads/hotel5.jpg"]
}

{
  "name": "Delhi Grand Royale",
  "city": "Delhi",
  "price": 15000,
  "rating": 4.5,
  "description": "A sophisticated blend of elegance and modernity, offering an unparalleled stay.",
  "images": ["/uploads/hotel9.jpg"]
}


*/