import React from 'react';
import './PastEvents.css';
import EventCard from '../components/EventCard';
import eventsData from '../events/events.json';

function PastEvents() {
  // Filter for past events (dates before today)
  // For now, showing empty as we only have future events in JSON
  // You can add past events to the JSON or create a separate past-events.json
  const today = new Date();
  
  const pastEvents = eventsData
    .filter(event => {
      const eventDate = new Date(event['Date']);
      return eventDate < today;
    })
    .map((event, index) => {
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
        speaker: event['Speaker'],
        blurb: event['Talk Blurb'],
        link: event['Online Eventbrite Link'],
        image: speakerImage
      };
    });

  return (
    <div className='past-events-page'>
      <div className='page-header'>
        <h1>PAST EVENTS</h1>
        <p>Explore our archive of talks, workshops, and special events</p>
      </div>

      <div className='events-container'>
        {pastEvents.length > 0 ? (
          <div className='events-grid'>
            {pastEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                buttonText='View Recording'
                showBadge={false}
              />
            ))}
          </div>
        ) : (
          <div className='no-events'>
            <p>No past events to display yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PastEvents;
