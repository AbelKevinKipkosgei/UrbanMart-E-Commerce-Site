import React, { useState } from 'react';
import './FeedbackModal.css';
import Rating from './Rating';

const FeedbackModal = ({ onClose, onSubmitFeedback, onSubmitRating }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (onSubmitFeedback && typeof onSubmitFeedback === 'function') {
      onSubmitFeedback(feedback);
      setFeedback('');
    } else {
      console.error("onSubmitFeedback is not a valid function");
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (onSubmitRating && typeof onSubmitRating === 'function') {
      onSubmitRating(rating);
      setRating(0);
    } else {
      console.error("onSubmitRating is not a valid function");
    }
  };

  return (
    <div className="feedback-modal">
      <h2>Feedback</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Enter your feedback here"
      />
      <button onClick={handleFeedbackSubmit}>Submit Feedback</button>

      <h2>Rate Us</h2>
      <Rating value={rating} onChange={setRating} />
      <button onClick={handleRatingSubmit}>Submit Rating</button>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default FeedbackModal;
