import React from 'react';
import './PastEvents.css';

function PastEvents() {
  // Sample past events data - replace with your actual events
  const pastEvents = [
    {
      id: 1,
      title: 'Past Event 1',
      date: '10 Dec 2025',
      time: '19:00 – 21:00',
      location: 'Online'
    },
    {
      id: 2,
      title: 'Past Event 2',
      date: '15 Dec 2025',
      time: '19:00 – 21:30',
      location: 'In-Person'
    },
    {
      id: 3,
      title: 'Past Event 3',
      date: '20 Dec 2025',
      time: '13:00 – 15:10',
      location: 'Online'
    }
  ];

  return (
    <div className='past-events-page'>
      <div className='page-header'>
        <h1>PAST EVENTS</h1>
        <p>Explore our archive of talks, workshops, and special events</p>
      </div>

      <div className='events-container'>
        <div className='events-grid'>
          {pastEvents.map(event => (
            <div key={event.id} className='event-card'>
              <div className='event-image'>
                {/* Add event image here */}
              </div>
              <div className='event-content'>
                <h3 className='event-title'>{event.title}</h3>
                <p className='event-date'>{event.date}, {event.time}</p>
                <p className='event-location'>{event.location}</p>
                <a href='#' className='event-button'>View Recording</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PastEvents;
