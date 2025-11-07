import React from 'react';
import './Footer.css';  // Import the custom CSS

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} MakeMyTrip Clone. Designed for DBMS Project.</p>
                <p className="footer-subtext">Authentication, Role-Based Access, and CRUD implemented.</p>
            </div>
        </footer>
    );
};

export default Footer;
