import {
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaUserTie,
} from 'react-icons/fa';
import ProjectSphere from '../../components/ProjectSphere/ProjectSphere';
import projects from '../../data/projects';
import styles from './Projects.module.css';

const Projects = () => {
  return (
    <main className={styles.projectsPage}>
      <section className={styles.hero} id="projects">
        <div className={styles.heroSphereWrap} aria-hidden="true">
          <ProjectSphere className={styles.heroSphere} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Projects</p>
          <h1>Selected contracting work across Saudi Arabia.</h1>
          <p>
            Jodran Al Khaleej supports industrial, commercial, infrastructure,
            and maintenance projects with disciplined execution and reliable site
            teams.
          </p>
        </div>
      </section>

      <section className={styles.projectSection} aria-label="Project list">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Our Work</p>
          <h2>Project capabilities</h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <article className={styles.card} key={project.id}>
              <project.icon className={styles.cardIcon} aria-hidden="true" />
              <div className={styles.cardBody}>
                <span className={styles.category}>{project.department}</span>
                <h3>{project.project}</h3>
                <p>{project.scope}</p>
                <dl className={styles.details}>
                  <div>
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div>
                    <dt>Main Contractor</dt>
                    <dd>{project.mainContractor}</dd>
                  </div>
                </dl>
                <div className={styles.meta}>
                  <span>
                    <FaMapMarkerAlt aria-hidden="true" />
                    {project.location}
                  </span>
                  <span>
                    <FaUserTie aria-hidden="true" />
                    {project.client}
                  </span>
                  <span>
                    <FaCalendarCheck aria-hidden="true" />
                    Delivered by Jodran teams
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Projects;
