import { Link } from 'react-router-dom';
import saudiMap from '../../assets/icons/map1.png';
import styles from './hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.content}>
        <p className={styles.eyebrow}>Contracting & Construction</p>
        <h1>
          <span className={styles.highlight}>JODRAN</span><br /> AL KHALEEJ
        </h1>
        <p className={styles.description}>
          Building reliable contracting solutions across Saudi Arabia with precision,
          safety, and disciplined project delivery.
        </p>
        <div className={styles.actions}>
            <Link className={styles.primaryButton} to="/projects">
              View Projects
            </Link>
          <Link className={styles.secondaryButton} to="/#about">
            About Company
          </Link>
        </div>
      </div>

      <div className={styles.visual} aria-label="Saudi Arabia service area">
        <img src={saudiMap} alt="Saudi Arabia map" />
      </div>
    </section>
  );
};

export default Hero;
