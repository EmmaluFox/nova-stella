import './App.css';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import UpcomingTalks from './pages/UpcomingTalks';
import PastEvents from './pages/PastEvents';
import Community from './pages/Community';


function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/upcoming-talks' element={<UpcomingTalks />} />
          <Route path='/past-events' element={<PastEvents />} />
          <Route path='/community' element={<Community />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
