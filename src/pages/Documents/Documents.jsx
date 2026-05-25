import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Documents.module.css';
import { FaFilePdf, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import DocumentsViewer from '../../components/DocumentsViewer/DocumentsViewer';

const documentsList = [
  {
    id: 'company-profile',
    title: 'Jodran Corporate Profile',
    type: 'PDF Document',
    size: '4.8 MB',
    description: 'Comprehensive brochure detailing company experience, data systems, fleet list, and core services.',
  },
  {
    id: 'commercial-registration',
    title: 'Commercial Registration (CR)',
    type: 'Official Certificate',
    size: '1.2 MB',
    description: 'Valid Commercial Registration certificate issued by the Ministry of Commerce in Saudi Arabia.',
  },
  {
    id: 'aramco-vendor',
    title: 'Aramco Vendor Approval',
    type: 'Vendor Certificate',
    size: '1.5 MB',
    description: 'Official Saudi Aramco vendor registration approval certificate supporting industrial site access.',
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Certificate',
    type: 'Quality Management',
    size: '2.1 MB',
    description: 'International standard certificate for robust quality control and execution disciplines.',
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001:2018 Certificate',
    type: 'Occupational Health & Safety',
    size: '2.0 MB',
    description: 'Certified safety compliance framework protecting workers and maintaining hazard-free sites.',
  },
  {
    id: 'chamber-certificate',
    title: 'Chamber of Commerce Cert.',
    type: 'Official Certificate',
    size: '0.8 MB',
    description: 'Active Chamber of Commerce certificate confirming local establishment status.',
  },
];

const Documents = ({ isDedicatedPage }) => {
  const location = useLocation();
  const showHero = isDedicatedPage !== undefined ? isDedicatedPage : location.pathname === '/documents';
  const [downloadStates, setDownloadStates] = useState({});

  const handleDownload = (docId, docTitle) => {
    if (downloadStates[docId]) {
      return;
    }

    // Set downloading state
    setDownloadStates((prev) => ({ ...prev, [docId]: 'loading' }));

    setTimeout(() => {
      // Create a mock file download
      const element = document.createElement('a');
      const file = new Blob(
        [
          `JODRAN AL KHALEEJ AL MUSTAQBAL CO. LTD.\n\nDocument: ${docTitle}\nVerification Status: Active & Valid\nDownload Timestamp: ${new Date().toISOString()}`,
        ],
        { type: 'text/plain' },
      );
      element.href = URL.createObjectURL(file);
      element.download = `${docId}_mock_verification.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Set completed state
      setDownloadStates((prev) => ({ ...prev, [docId]: 'done' }));

      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadStates((prev) => {
          const updated = { ...prev };
          delete updated[docId];
          return updated;
        });
      }, 3000);
    }, 1500);
  };

  return (
    <main className={styles.documentsPage}>
      {/* Hero Section */}
      {showHero && (
        <section className={styles.hero} id="documents-hero">
          <div className={styles.heroSphereWrap} aria-hidden="true">
            <DocumentsViewer className={styles.heroSphere} />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Qualifications</p>
            <h1>
              Corporate <span className={styles.accent}>Registrations</span> <br />& Certificates
            </h1>
            <p className={styles.heroDescription}>
              Review and verify our official credentials, ISO certifications, and vendor registrations.
              Download verify receipts for your corporate records.
            </p>
          </div>
        </section>
      )}

      {/* Documents Grid Section */}
      <section className={styles.documents} id="documents">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Qualifications</p>
            <h2>Corporate Registrations & Certificates</h2>
            <p className={styles.lead}>
              Review and verify our official credentials, ISO certifications, and vendor registrations.
              Download verify receipts for your corporate records.
            </p>
          </div>

          <div className={styles.grid}>
            {documentsList.map((doc) => {
              const state = downloadStates[doc.id];

              return (
                <article className={styles.card} key={doc.id}>
                  <div className={styles.cardHeader}>
                    <FaFilePdf className={styles.pdfIcon} aria-hidden="true" />
                    <div>
                      <span className={styles.type}>{doc.type}</span>
                      <span className={styles.size}>{doc.size}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <h3>{doc.title}</h3>
                    <p>{doc.description}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={`${styles.downloadBtn} ${state === 'done' ? styles.doneBtn : ''}`}
                      onClick={() => handleDownload(doc.id, doc.title)}
                      disabled={state === 'loading'}
                    >
                      {state === 'loading' ? (
                        <>
                          <FaSpinner className={styles.spinner} aria-hidden="true" />
                          Verifying...
                        </>
                      ) : state === 'done' ? (
                        <>
                          <FaCheck aria-hidden="true" />
                          Verified & Saved
                        </>
                      ) : (
                        <>
                          <FaDownload aria-hidden="true" />
                          Download PDF
                        </>
                      )}
                    </button>
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

export default Documents;
