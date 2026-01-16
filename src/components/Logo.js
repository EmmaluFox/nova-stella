import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/2.png';
import './Logo.css';

function Logo({ onClick }) {
  return (
    <Link to='/' className='navbar-logo' onClick={onClick}>
      <img className="logo" src={logo} width={70} height={70} alt="Nova Stella" />
      NOVA STELLA
      <i className='fab fa-typo3' />
    </Link>
  );
}

export default Logo;
