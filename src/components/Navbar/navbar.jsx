import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/icons/logo2.png';
import styles from './navbar.module.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects'},
  { label: 'Client', href: '/client' },
  { label: 'Services', href: '/service' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Equipment', href: '/equipment' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const MenuIcon = isOpen ? FaTimes : FaBars;

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main navigation">
        <Link className={styles.brand} to="/" onClick={closeMenu}>
          <img className={styles.logo} src={logo} alt="Jodran logo" />
          <span className={styles.brandText}>JODRAN AL KHALEEJ</span>
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <MenuIcon />
        </button>

        <div className={`${styles.links} ${isOpen ? styles.linksOpen : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              className={({ isActive }) => 
                `${link.icon ? styles.mobileAction : ''} ${isActive ? styles.activeLink : ''}`
              }
              to={link.href}
              onClick={closeMenu}
              end={link.href === '/'}
            >
              <span className={styles.desktopLabel}>{link.label}</span>
              {link.mobileLabel && (
                <span className={styles.mobileLabel}>{link.mobileLabel}</span>
              )}
              {link.icon && <link.icon className={styles.mobileIcon} aria-hidden="true" />}
            </NavLink>
          ))}
          <Link className={styles.cta} to="/#about" onClick={closeMenu}>
            About
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
