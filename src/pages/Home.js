import React from 'react';
import './Home.css';
import eventsData from '../events/events.json';

function Home() {
  // Get the first upcoming event for the Classes & Events section
  let firstEvent = null;
  let eventImage = null;
  
  if (eventsData && eventsData.length > 0) {
    const event = eventsData[0];
    firstEvent = {
      title: event['Talk Title'],
      speaker: event['Speaker'],
      date: event['Date'],
      venue: event['Venue'],
      city: event['City']
    };
    
    // Try to load speaker image
    if (event['Speaker']) {
      try {
        eventImage = require(`../assets/Speaker Photos/Square/${event['Speaker']} Square.jpg`);
      } catch (err) {
        console.log(`Image not found for ${event['Speaker']}`);
      }
    }
  }

  return (
    <div className='home-page'>
      {/* Main Content Sections */}
      <div className='home-sections'>
        {/* Section 1 */}
        <div className='home-section'>
          <div className='section-container'>
            <h2 className='section-header'>CLASSES & EVENTS</h2>
            <div className='section-layout'>
              <div className='section-image'>
                {eventImage && <img src={eventImage} alt={firstEvent?.speaker} />}
              </div>
              <div className='section-content'>
                {firstEvent && (
                  <div className='next-event-info'>
                    <h3>{firstEvent.title}</h3>
                    <p className='event-speaker-name'>{firstEvent.speaker}</p>
                    <p className='event-details'>{firstEvent.date} • {firstEvent.venue}, {firstEvent.city}</p>
                  </div>
                )}
                <p className='section-description'></p>
              </div>
              <div className='section-image-mobile'>
                {eventImage && <img src={eventImage} alt={firstEvent?.speaker} />}
              </div>
              <a href='/upcoming-talks' className='section-link'>Learn More →</a>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className='home-section reverse'>
          <div className='section-container'>
            <h2 className='section-header'>PAST EVENTS</h2>
            <div className='section-layout'>
              <div className='section-image'>
                {/* Add your image here */}
              </div>
              <div className='section-content'>
                <p>Explore our archive of past talks and events.</p>
              </div>
              <a href='/past-events' className='section-link'>View Archive →</a>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className='home-section'>
          <div className='section-container'>
            <h2 className='section-header'>MEMBERSHIP</h2>
            <div className='section-layout'>
              <div className='section-image'>
                {/* Add your image here */}
              </div>
              <div className='section-content'>
                <p className='section-description'>Join our inner circle and get exclusive access to our bank of recorded lectures, event discounts and other treats.</p>
              </div>
              <a href='/community' className='section-link'>Join Now →</a>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className='home-section reverse'>
          <div className='section-container'>
            <h2 className='section-header'>ABOUT US</h2>
            <div className='section-layout'>
              <div className='section-image'>
                {/* Add your image here */}
              </div>
              <div className='section-content'>
                <p className='section-description'>Learn more about Nova Stella and our mission.</p>
              </div>
              <a href='/about' className='section-link'>Discover More →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className='home-footer'>
        <div className='footer-content'>
          <div className='footer-column'>
            <h3>CONTACT US</h3>
            <p>Email: info@novastella.com</p>
          </div>
          <div className='footer-column'>
            <h3>FOLLOW US</h3>
            <p className='section-description'>Connect with us on social media</p>
          </div>
          <div className='footer-column'>
            <h3>SUBSCRIBE</h3>
            <p>Join our mailing list for updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
