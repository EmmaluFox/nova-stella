import React, { useState } from 'react';
import './EventCard.css';

function EventCard({ event, buttonText = 'Info & Booking', showBadge = false }) {
  const [expanded, setExpanded] = useState(false);
  const BLURB_LIMIT = 200;

  function renderBlurb(text){
    if(!text) return null;
    // preserve newlines
    return text.split('\n').map((line, i) => (
      <p key={i} className="event-info-line">{line}</p>
    ));
  }

  function renderTruncated(text){
    if(!text) return null;
    if(text.length <= BLURB_LIMIT) return renderBlurb(text);
    const truncated = text.slice(0, BLURB_LIMIT);
    // avoid cutting mid-word
    const lastSpace = truncated.lastIndexOf(' ');
    const safe = truncated.slice(0, lastSpace > 0 ? lastSpace : BLURB_LIMIT);
    return (
      <>
        {renderBlurb(safe + '...')}
      </>
    );
  }
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
            <div className='event-info-text'>
              {expanded ? renderBlurb(event.blurb) : renderTruncated(event.blurb)}
              {event.blurb.length > BLURB_LIMIT && (
                <button
                  className='event-blurb-toggle'
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
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
