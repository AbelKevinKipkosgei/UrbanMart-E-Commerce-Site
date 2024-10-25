// File: src/components/Footer.js
import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import './Footer.css';

function Footer() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 UrbanMart. All Rights Reserved.</p>
                <button onClick={handleOpenModal} className="feedback-button">
                    Give Feedback / Rate Products
                </button>
                {showModal && <FeedbackModal onClose={handleCloseModal} />}
            </div>
        </footer>
    );
}

export default Footer;
