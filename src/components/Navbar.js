import React from 'react';
import Logo from './Logo';
import './NavBar.css';

function Navbar() {
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Logo />
        <h1 className='navbar-title'>NOVA STELLA</h1>
      </div>
    </nav>
  );
}

export default Navbar;
