import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import services from '../../data/services';
import styles from './service.module.css';
import ClientNetwork from '../../components/ClientNetwork/ClientNetwork';
import {
  FaBuilding,
  FaShieldAlt,
  FaNetworkWired,
  FaRoad,
  FaBolt,
  FaSignal,
  FaArrowRight,
} from 'react-icons/fa';

const serviceIcons = {
  'building-works': FaBuilding,
  'fence-works': FaShieldAlt,
  'infrastructure-works': FaNetworkWired,
  'hard-scape-works': FaRoad,
  'electrical-mechanical': FaBolt,
  'optical-fibers': FaSignal,
};

const Service = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main className={styles.servicesPage}>
      <section className={styles.hero} id="services">
        <div className={styles.heroSphereWrap} aria-hidden="true">
          <ClientNetwork className={styles.heroSphere} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Capabilities</p>
          <h1>
            Our <span className={styles.accent}>Services</span> & Specializations
          </h1>
          <p>
            Jodran Al Khaleej delivers comprehensive civil, structural, infrastructure,
            and telecom network contracting services across Saudi Arabia.
          </p>
        </div>
      </section>

      <section className={styles.servicesSection} aria-label="Services list">
        <div className={styles.grid}>
          {services.map((service) => {
            const Icon = serviceIcons[service.id] || FaBuilding;

            return (
              <article className={styles.card} key={service.id}>
                <div className={styles.cardHeader}>
                  <Icon className={styles.cardIcon} aria-hidden="true" />
                  <h3>{service.title}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p>{service.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <Link className={styles.ctaLink} to="/projects">
                    View Related Projects
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Service;
