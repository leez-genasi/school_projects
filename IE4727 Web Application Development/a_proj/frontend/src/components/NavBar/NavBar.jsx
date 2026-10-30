import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  const linkClass = (path, hash = '') => {
    const active = location.pathname === path && (!hash || location.hash === hash);
    return `nav-link${active ? ' active' : ''}`;
  };

  return (
    <nav className="navbar site-nav">
      <div className="container-fluid px-4">
        <Link className="navbar-brand brand" to="/" onClick={closeMenu}>theatre</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="nav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`nav-menu${menuOpen ? ' is-open' : ''}`} id="nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={linkClass('/')} to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass('/calendar')} to="/calendar" onClick={closeMenu}>Upcoming Shows</Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass('/visit', '#getting-here')} to="/visit#getting-here" onClick={closeMenu}>Getting Here</Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass('/visit', '#contact')} to="/visit#contact" onClick={closeMenu}>Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass('/behind-the-curtain')} to="/behind-the-curtain" onClick={closeMenu}>Behind the Curtain</Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass('/cart')} to="/cart" onClick={closeMenu}>Cart</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
