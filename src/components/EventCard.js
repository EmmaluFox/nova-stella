import React from 'react';
import './EventCard.css';

function EventCard({ event, buttonText = 'Info & Booking', showBadge = false }) {
  return (
    <div className='event-card'>
      <div className='event-image'>
        {event.image && <img src={event.image} alt={event.title} />}
      </div>
      <div className='event-content'>
        {showBadge && event.status === 'sold-out' && (
          <span className='event-badge sold-out'>Sold Out</span>
        )}
        <h3 className='event-title'>{event.title}</h3>
        {event.speaker && (
          <p className='event-speaker'>{event.speaker}</p>
        )}
        <p className='event-date'>{event.date}, {event.time}</p>
        <p className='event-location'>{event.location}</p>
        {event.blurb && (
          <div className='event-info'>
            <p className='event-info-text'>{event.blurb}</p>
          </div>
        )}
        <a href={event.link || '#'} className='event-button'>
          {event.status === 'sold-out' ? 'Details' : buttonText}
        </a>
      </div>
    </div>
  );
}

export default EventCard;
