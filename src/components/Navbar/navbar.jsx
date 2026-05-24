import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/icons/Logo2.png';
import styles from './navbar.module.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects'},
  { label: 'Leadership', href: '/#leadership' },
  { label: 'Services', href: '/#services' },
  { label: 'Client', href: '/#client' },
  { label: 'Equipment', href: '/#equipment' },
  { label: 'Documents', href: '/#documents' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const MenuIcon = isOpen ? FaTimes : FaBars;

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main navigation">
        <a className={styles.brand} href="/" onClick={closeMenu}>
          <img className={styles.logo} src={logo} alt="Jodran logo" />
          <span className={styles.brandText}>JODRAN AL KHALEEJ</span>
        </a>

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
            <a
              key={link.href}
              className={link.icon ? styles.mobileAction : undefined}
              href={link.href}
              onClick={closeMenu}
            >
              <span className={styles.desktopLabel}>{link.label}</span>
              {link.mobileLabel && (
                <span className={styles.mobileLabel}>{link.mobileLabel}</span>
              )}
              {link.icon && <link.icon className={styles.mobileIcon} aria-hidden="true" />}
            </a>
          ))}
          <a className={styles.cta} href="/#about" onClick={closeMenu}>
            About
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
