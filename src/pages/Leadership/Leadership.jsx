import { useLocation, Link } from 'react-router-dom';
import team from '../../data/team';
import styles from './Leadership.module.css';
import { FaUserTie, FaGraduationCap, FaBriefcase, FaArrowRight } from 'react-icons/fa';
import LeadershipEngineer from '../../components/LeadershipEngineer/LeadershipEngineer';

const Leadership = ({ isDedicatedPage }) => {
  const location = useLocation();
  const showHero = isDedicatedPage !== undefined ? isDedicatedPage : location.pathname === '/leadership';
  return (
    <main className={styles.leadershipPage}>
      {/* Hero Section */}
      {showHero && (
        <section className={styles.hero} id="leadership-hero">
          <div className={styles.heroSphereWrap} aria-hidden="true">
            <LeadershipEngineer className={styles.heroSphere} />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Leadership Team</p>
            <h1>
              <span className={styles.accent}>Professional</span> Engineers <br />& Management
            </h1>
            <p className={styles.heroDescription}>
              Jodran Al Khaleej is directed by highly qualified engineering and project
              management professionals dedicated to maintaining standard specifications and safety controls.
            </p>
            
          </div>
        </section>
      )}

      {/* Leadership Grid Section */}
      <section className={styles.leadership} id="leadership">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Leadership Team</p>
            <h2>Professional Engineers & Management</h2>
            <p className={styles.lead}>
              Jodran Al Khaleej is directed by highly qualified engineering and project
              management professionals dedicated to maintaining standard specifications and safety controls.
            </p>
          </div>

          <div className={styles.grid}>
            {team.map((member) => (
              <article className={styles.card} key={member.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrap}>
                    <FaUserTie className={styles.avatarIcon} aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{member.name}</h3>
                    <span className={styles.role}>{member.role}</span>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <FaBriefcase aria-hidden="true" />
                      <strong>Experience:</strong> {member.experience}
                    </span>
                    <span className={styles.metaItem}>
                      <FaGraduationCap aria-hidden="true" />
                      <strong>Focus:</strong> {member.specialty}
                    </span>
                  </div>
                  <p className={member.bio ? styles.bio : styles.emptyBio}>
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.sectionFooter}>
            <Link className={styles.documentBtn} to="/documents">
              View Qualifications & Documents
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Leadership;
