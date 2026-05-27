import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaUserTie,
} from 'react-icons/fa';
import ProjectSphere from '../../components/ProjectSphere/ProjectSphere';
import clients from '../../data/clients';
import projects from '../../data/projects';
import styles from './Projects.module.css';

const getClient = (clientName) => clients.find((client) => client.name === clientName);

const PROJECTS_PER_PAGE = 9;

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <main className={styles.projectsPage}>
      <section className={styles.hero} id="projects">
        <div className={styles.heroSphereWrap} aria-hidden="true">
          <ProjectSphere className={styles.heroSphere} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Projects</p>
          <h1>
            <span className={styles.accent}>Projects</span> delivered with precision.
          </h1>
          <p>
            Industrial, commercial, infrastructure, and maintenance work by
            Jodran Al Khaleej teams.
          </p>
        </div>
      </section>

      <section className={styles.projectSection} aria-label="Project list">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Our Work</p>
          <h2>Project capabilities</h2>
        </div>

        <div className={styles.grid}>
          {currentProjects.map((project) => {
            const client = getClient(project.client);
            const clientHref = client ? `/client/${client.id}` : '/client';

            return (
              <article className={styles.card} key={project.id}>
                <project.icon className={styles.cardIcon} aria-hidden="true" />
                <div className={styles.cardBody}>
                  <span className={styles.category}>{project.department}</span>
                  <h3>{project.project}</h3>
                  <p>{project.scope}</p>
                  <dl className={styles.details}>
                    
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
                    <Link className={styles.metaLink} to={clientHref}>
                      <FaUserTie aria-hidden="true" />
                      {project.client}
                    </Link>
                    <span>
                      <FaCalendarCheck aria-hidden="true" />
                      Delivered by Jodran teams
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationBtn}
            >
              Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationBtn}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Projects;
