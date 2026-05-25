import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from 'react-icons/fa';
import logo from '../../assets/icons/logo2.png';
import styles from './footer.module.css';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Services', href: '/service' },
];

const companyLinks = [
  { label: 'Clients', href: '/client' },
  { label: 'Equipment', href: '/equipment' },
  { label: 'Documents', href: '/documents' },
  { label: 'About', href: '/#about' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link className={styles.brand} to="/" aria-label="Jodran Al Khaleej home">
            <img src={logo} alt="Jodran logo" />
            <span>JODRAN AL KHALEEJ</span>
          </Link>
          <p>
            JODRAN AL KHALEEJ AL MUSTAQBAL CO. LTD.
            Establishment began as a General works
            Contractor in 1995.
          </p>
        </div>

        <nav className={styles.linkColumn} aria-label="Footer navigation">
          <h2>Quick Links</h2>
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.linkColumn} aria-label="Company navigation">
          <h2>Company</h2>
          {companyLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <address className={styles.contactColumn}>
          <h2>Contact</h2>
          <a href="https://maps.app.goo.gl/PQHA16HK8jpGsYGm7?g_st=iw">
            <FaMapMarkerAlt aria-hidden="true" />
            <span>Saudi Arabia - Dammam</span>
          </a>
          <a href="tel:+966593622380">
            <FaPhoneAlt aria-hidden="true" />
            <span>+966 59 362 2380</span>
          </a>
          <a href="mailto:info@jodran-alkhaleej.com">
            <FaEnvelope aria-hidden="true" />
            <span>info@jodran-alkhaleej.com</span>
          </a>
        </address>
      </div>

      <div className={styles.bottomBar}>
        <p>© {year} Jodran Al Khaleej. All rights reserved.</p>
        <button
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </button>
      </div>
    </footer>
  );
};

export default Footer;
