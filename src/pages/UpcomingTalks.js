import React from 'react';
import './UpcomingTalks.css';

function UpcomingTalks() {
  // Sample events data - replace with your actual events
  const events = [
    {
      id: 1,
      title: 'Sample Event 1',
      date: '20 Jan 2026',
      time: '19:00 – 21:00',
      location: 'Online',
      status: 'available'
    },
    {
      id: 2,
      title: 'Sample Event 2',
      date: '22 Jan 2026',
      time: '19:00 – 21:30',
      location: 'In-Person',
      status: 'available'
    },
    {
      id: 3,
      title: 'Sample Event 3',
      date: '25 Jan 2026',
      time: '13:00 – 15:10',
      location: 'Online',
      status: 'sold-out'
    }
  ];

  return (
    <div className='upcoming-talks-page'>
      <div className='page-header'>
        <h1>UPCOMING TALKS & EVENTS</h1>
        <p>Join us for our upcoming lectures, workshops, and discussions</p>
      </div>

      <div className='events-container'>
        <div className='events-grid'>
          {events.map(event => (
            <div key={event.id} className='event-card'>
              <div className='event-image'>
                {/* Add event image here */}
              </div>
              <div className='event-content'>
                {event.status === 'sold-out' && (
                  <span className='event-badge sold-out'>Sold Out</span>
                )}
                <h3 className='event-title'>{event.title}</h3>
                <p className='event-date'>{event.date}, {event.time}</p>
                <p className='event-location'>{event.location}</p>
                <a href='#' className='event-button'>
                  {event.status === 'sold-out' ? 'Details' : 'Info & Booking'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingTalks;
