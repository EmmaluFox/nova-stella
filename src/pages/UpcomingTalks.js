import React from 'react';
import './UpcomingTalks.css';
import EventCard from '../components/EventCard';
import eventsData from '../events/events.json';

function UpcomingTalks() {
  // Transform events.json data to match EventCard props
  const events = eventsData.map((event, index) => {
    let speakerImage = null;
    
    // Try to import speaker image if speaker name exists
    if (event['Speaker']) {
      try {
        speakerImage = require(`../assets/Speaker Photos/${event['Speaker']}.jpeg`);
      } catch (err) {
        // Image not found, will use default gradient background
        console.log(`Image not found for ${event['Speaker']}`);
      }
    }
    
    return {
      id: event['Event ID'] || index,
      title: event['Talk Title'],
      date: event['Date'],
      time: `${event['Start Time']} – ${event['End Time']}`,
      location: `${event['Venue']}, ${event['City']}`,
      status: 'available',
      speaker: event['Speaker'],
      blurb: event['Talk Blurb'],
      link: event['In Person Eventbrite Link'],
      // Prefer an explicit event image from the data file, fall back to speaker photo
      image: event['Image'] || speakerImage
    };
  });

  return (
    <div className='upcoming-talks-page'>
      <div className='page-header'>
        <h1>UPCOMING TALKS & EVENTS</h1>
        <p>Join us for our upcoming lectures, workshops, and discussions</p>
      </div>

      <div className='events-container'>
        <div className='events-grid'>
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              buttonText='Info & Booking'
              showBadge={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingTalks;
