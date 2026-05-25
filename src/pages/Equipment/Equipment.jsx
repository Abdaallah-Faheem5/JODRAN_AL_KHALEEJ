import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import equipment from '../../data/equipment';
import styles from './Equipment.module.css';
import EquipmentBulldozer from '../../components/EquipmentBulldozer/EquipmentBulldozer';

const Equipment = ({ isDedicatedPage }) => {
  const location = useLocation();
  const showHero = isDedicatedPage !== undefined ? isDedicatedPage : location.pathname === '/equipment';
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const list = new Set(equipment.map((item) => item.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter equipment based on active category
  const filteredEquipment = useMemo(() => {
    if (activeCategory === 'All') {
      return equipment;
    }
    return equipment.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className={styles.equipmentPage}>
      {/* Hero Section */}
      {showHero && (
        <section className={styles.hero} id="equipment-hero">
          <div className={styles.heroSphereWrap} aria-hidden="true">
            <EquipmentBulldozer className={styles.heroSphere} />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Machinery & Fleet</p>
            <h1>
              Our <span className={styles.accent}>Equipment</span> Fleet
            </h1>
            <p className={styles.heroDescription}>
              Jodran Al Khaleej owns and operates a robust fleet of heavy construction machinery
              and specialized utility tools to execute civil, infrastructure, and telecom projects.
            </p>
          </div>
        </section>
      )}

      {/* Equipment Grid Section */}
      <section className={styles.equipment} id="equipment">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <h2>Browse Our Fleet</h2>
            <p className={styles.lead}>
              Jodran Al Khaleej owns and operates a robust fleet of heavy construction machinery
              and specialized utility tools to execute civil, infrastructure, and telecom scopes.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Equipment categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.tab} ${activeCategory === category ? styles.activeTab : ''}`}
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Equipment Grid */}
          <div className={styles.grid}>
            {filteredEquipment.map((item) => {
              const Icon = item.icon;

              return (
                <article className={styles.card} key={item.id}>
                  <div className={styles.cardHeader}>
                    <Icon className={styles.icon} aria-hidden="true" />
                    <span className={styles.badge}>{item.category}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{item.name}</h3>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Model:</span>
                      <span className={styles.specVal}>{item.model}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Available Units:</span>
                      <span className={styles.specVal}>{item.quantity}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Equipment;
