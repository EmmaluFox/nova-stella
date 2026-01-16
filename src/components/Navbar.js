import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './NavBar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoClick = (e) => {
    // On mobile, prevent navigation and toggle menu instead
    if (window.innerWidth <= 768) {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='logo-wrapper' onClick={handleLogoClick}>
          <Logo />
        </div>
        <h1 className='navbar-title'>NOVA STELLA</h1>
        
        {/* Desktop Navigation */}
        <ul className='nav-menu desktop-nav'>
          <li className='nav-item'>
            <Link to='/about' className='nav-link'>
              About
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/upcoming-talks' className='nav-link'>
              Upcoming Talks
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/past-events' className='nav-link'>
              Past Events
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/community' className='nav-link'>
              Community
            </Link>
          </li>
        </ul>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <ul className='nav-menu mobile-nav'>
            <li className='nav-item'>
              <Link to='/' className='nav-link' onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/about' className='nav-link' onClick={closeMenu}>
                About
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/upcoming-talks' className='nav-link' onClick={closeMenu}>
                Upcoming Talks
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/past-events' className='nav-link' onClick={closeMenu}>
                Past Events
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/community' className='nav-link' onClick={closeMenu}>
                Community
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
