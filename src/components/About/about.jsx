import {
  FaClipboardCheck,
  FaHardHat,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';
import styles from './about.module.css';

const highlights = [
  {
    icon: FaHardHat,
    title: 'General Contracting',
    text: 'Experienced field teams for civil, construction, and site support works.',
  },
  {
    icon: FaShieldAlt,
    title: 'Safety Focused',
    text: 'Work is planned around site discipline, safety controls, and reliable delivery.',
  },
  {
    icon: FaUsers,
    title: 'Client Support',
    text: 'Clear coordination with clients, suppliers, and teams through every project stage.',
  },
];

const About = () => {
  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>About Company</p>
          <h2>Jodran Al Khaleej Al Mustaqbal Co. Ltd.</h2>
          <p className={styles.lead}>
            Establishment began as a general works contractor in 1995. Since then,
            Jodran Al Khaleej has supported construction and contracting projects
            across Saudi Arabia with practical execution, disciplined planning, and
            dependable site teams.
          </p>
          <div className={styles.statement}>
            <FaClipboardCheck aria-hidden="true" />
            <span>
              We focus on delivering work that is organized, safe, and aligned with
              each client&apos;s project requirements.
            </span>
          </div>
        </div>

        <div className={styles.panel} aria-label="Company overview">
          <div className={styles.stat}>
            <strong>1995</strong>
            <span>Established</span>
          </div>
          <div className={styles.stat}>
            <strong>30+</strong>
            <span>Years of Experience</span>
          </div>
          <div className={styles.stat}>
            <strong>KSA</strong>
            <span>Saudi Arabia Operations</span>
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {highlights.map((item) => (
          <article className={styles.card} key={item.title}>
            <item.icon aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default About;
