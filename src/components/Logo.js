import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';
import logo from '../assets/2.png';

function Logo() {
  return (
    <Link to='/' className='logo-link'>
      <div className='logo-container'>
        <img src={logo} alt='Nova Stella Logo' className='logo-image' />
      </div>
    </Link>
  );
}

export default Logo;
