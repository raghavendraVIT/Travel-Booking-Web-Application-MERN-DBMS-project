import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const FeatureCard = ({ title, description, link, icon }) => (
    <div className="feature-card">
        <div className="icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <Link to={link} className="explore-link">
            Explore Now &rarr;
        </Link>
    </div>
);

const HomePage = () => {
    return (
        <div className="homepage-container">
            
            <div className="hero-section">
                <h1 className="hero-title">Your Next Adventure Starts Here</h1>
                <p className="hero-subtitle">
                    Seamlessly book flights and hotels with our MakeMyTrip Clone.
                </p>
                <div className="cta-buttons">
                    <Link to="/flights" className="cta-button flight-button">
                        Book a Flight
                    </Link>
                    <Link to="/hotels" className="cta-button hotel-button">
                        Find a Hotel
                    </Link>
                </div>
            </div>

            
            <h2 className="services-title">Our Services</h2>
            <div className="services-container">
                <FeatureCard 
                    title="Flights"
                    description="Search, compare, and book the cheapest flights to any destination worldwide."
                    link="/flights"
                    icon="✈️"
                />
                <FeatureCard 
                    title="Hotels"
                    description="Discover the best hotels and resorts for your stay, sorted by price and city."
                    link="/hotels"
                    icon="🏨"
                />
                <FeatureCard 
                    title="My Bookings"
                    description="View, manage, and cancel your confirmed flight and hotel reservations easily."
                    link="/my-bookings"
                    icon="📘"
                />
            </div>
        </div>
    );
};

export default HomePage;