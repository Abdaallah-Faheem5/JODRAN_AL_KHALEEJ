import { useMemo } from 'react';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaHandshake,
  FaMapMarkerAlt,
  FaUserTie,
} from 'react-icons/fa';

import clients from '../../data/clients';
import projects from '../../data/projects';
import styles from './client.module.css';
import ClientNetwork from '../../components/ClientPerson/ClientPerson';

const Client = () => {
  const clientIdFromPath = window.location.pathname.split('/')[2];
  const isDetailPage = Boolean(clientIdFromPath);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === clientIdFromPath),
    [clientIdFromPath],
  );

  const clientProjects = useMemo(() => {
    if (!selectedClient) {
      return [];
    }

    const matchValue = selectedClient.projectMatch || selectedClient.name;
    const normalizedMatch = matchValue.toLowerCase();

    return projects.filter((project) => (
      project.client.toLowerCase().includes(normalizedMatch)
      || project.mainContractor.toLowerCase().includes(normalizedMatch)
    ));
  }, [selectedClient]);

  if (isDetailPage && !selectedClient) {
    return (
      <main className={styles.clientPage}>
        <section className={styles.notFound}>
          <p className={styles.eyebrow}>Client</p>
          <h1>Client not found.</h1>
          <a className={styles.detailsButton} href="/client">
            Back to Clients
          </a>
        </section>
      </main>
    );
  }

  if (isDetailPage && selectedClient) {
    return (
      <main className={styles.clientPage}>
        <section className={styles.detailHero} id="client">
          <div className={styles.heroSphereWrap} aria-hidden="true">
             
          </div>
          
          <div className={styles.heroContent}>
            <div>
              <p className={styles.eyebrow}>Client Details</p>
              <h1>{selectedClient.name}</h1>
              <p>{selectedClient.details}</p>
            </div>
            <a className={styles.backLink} href="/client">
              Back to Clients
            </a>
          </div>
          
        </section>

        <section className={styles.detailsSection} aria-label={`${selectedClient.name} details`}>
          <dl className={styles.facts}>
              <div>
                <dt>Sector</dt>
                <dd>{selectedClient.sector}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selectedClient.location}</dd>
              </div>
              <div>
                <dt>Projects</dt>
                <dd>{clientProjects.length} related work scopes</dd>
              </div>
            </dl>

          <div className={styles.projectBlock}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Related Projects</p>
              <h2>Work delivered for {selectedClient.name}</h2>
            </div>

            <div className={styles.projectGrid}>
              {clientProjects.length > 0 ? (
                clientProjects.map((project) => (
                  <article className={styles.projectCard} key={project.id}>
                    <project.icon className={styles.projectIcon} aria-hidden="true" />
                    <div>
                      <span className={styles.category}>{project.department}</span>
                      <h3>{project.project}</h3>
                      <p>{project.scope}</p>
                      <div className={styles.meta}>
                        <span>
                          <FaMapMarkerAlt aria-hidden="true" />
                          {project.location}
                        </span>
                        <span>
                          <FaUserTie aria-hidden="true" />
                          {project.mainContractor}
                        </span>
                        <span>
                          <FaCalendarCheck aria-hidden="true" />
                          Delivered by Jodran teams
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.emptyState}>
                  No related projects are listed for this client yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.clientPage}>
      <section className={styles.hero} id="client">
        <div className={styles.heroSphereWrap} aria-hidden="true">
          <ClientNetwork className={styles.heroSphere} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Clients</p>
          <h1>
            <span className={styles.accent}>Clients</span> we<br /> work with.
          </h1>
          <p>
            Contractor and client partnerships across Jodran Al Khaleej
            projects.
          </p>
        </div>
      </section>

      <section className={styles.clientSection} aria-label="Client list">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Our Clients</p>
          <h2>Client relationships</h2>
        </div>

        <div className={styles.grid}>
          {clients.map((client) => (
            <article className={styles.card} key={client.id}>
              <client.icon className={styles.cardIcon} aria-hidden="true" />
              <div className={styles.cardBody}>
                <span className={styles.category}>{client.sector}</span>
                <h3>{client.name}</h3>
                <p>{client.summary}</p>
                <div className={styles.meta}>
                  <span>
                    <FaMapMarkerAlt aria-hidden="true" />
                    {client.location}
                  </span>
                  <span>
                    <FaHandshake aria-hidden="true" />
                    {client.relationship}
                  </span>
                </div>
                <a
                  className={styles.detailsButton}
                  href={`/client/${client.id}`}
                >
                  More Details
                  <FaArrowRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Client;
