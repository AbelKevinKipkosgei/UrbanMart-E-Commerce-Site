import React from 'react';
import './Rating.css';

const Rating = ({ value, onChange }) => {
  const handleStarClick = (newRating) => {
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${value >= star ? 'selected' : ''}`}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
