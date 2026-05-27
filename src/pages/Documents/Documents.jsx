import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Documents.module.css';
import { FaFilePdf, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import DocumentsViewer from '../../components/DocumentsViewer/DocumentsViewer';


import commercialRegistrationPdf from './../../assets/documents/السجل التجاري.pdf';
import qrCertificatePdf from '../../assets/documents/اوراق الشركة الرسمية مجمعة-1.pdf';
import commercialActivityLicensePdf from '../../assets/documents/اوراق الشركة الرسمية مجمعة-6.pdf';
import wageProtectionPdf from '../../assets/documents/اوراق الشركة الرسمية مجمعة-9.pdf';
import saudizationCertificatePdf from '../../assets/documents/اوراق الشركة الرسمية مجمعة-10.pdf';
import violationsClearancePdf from '../../assets/documents/اوراق الشركة الرسمية مجمعة-11.pdf';
import servicesInvestmentLicensePdf from '../../assets/documents/ترخيص وزارة الاستثمار .pdf';
import vatRegistrationPdf from '../../assets/documents/شهادة الضريبة المضافة.pdf';

const documentsList = [
 {
  id: 'commercial-registration',
  title: 'Commercial Registration (CR)',
  type: 'Official Certificate',
  size: '1.2 MB',
  file: commercialRegistrationPdf,
  description:
    'Official Commercial Registration certificate issued by the Ministry of Commerce of Saudi Arabia, confirming the company’s legal business status and active registration.',
},
  {
  id: 'qr-certificate',
  title: 'Quick Response Code Certificate',
  type: 'Business Verification',
  size: '0.9 MB',
  file: qrCertificatePdf,
  description:
    'Official QR Code certificate issued by the Saudi Business Center, enabling instant access to the company’s updated legal and commercial information.',
},
  {
  id: 'commercial-activity-license',
  title: 'Commercial Activity License',
  type: 'Municipal License',
  size: '1.4 MB',
  file: commercialActivityLicensePdf,
  description:
    'Official Commercial Activity License issued by Balady Services, authorizing the company to conduct general building construction and related contracting activities within Saudi Arabia.',
},
  {
  id: 'wage-protection-certificate',
  title: 'Wage Protection Compliance Certificate',
  type: 'Compliance Certificate',
  size: '1.1 MB',
  file: wageProtectionPdf,
  description:
    'Official Wage Protection Compliance Certificate issued by the Ministry of Human Resources and Social Development, confirming the company’s compliance with employee wage protection regulations in Saudi Arabia.',
},
 {
  id: 'saudization-certificate',
  title: 'Saudization Certificate',
  type: 'Compliance Certificate',
  size: '1.0 MB',
  file: saudizationCertificatePdf,
  description:
    'Official Saudization Certificate issued by the Ministry of Human Resources and Social Development, confirming the company’s compliance with national workforce localization requirements in Saudi Arabia.',
},
  {
  id: 'violations-clearance-certificate',
  title: 'Violations Clearance Certificate',
  type: 'Compliance Certificate',
  size: '0.9 MB',
  file: violationsClearancePdf,
  description:
    'Official Violations Clearance Certificate issued by the Ministry of Human Resources and Social Development, confirming that the company has no registered labor violations or outstanding compliance penalties.',
},
{
  id: 'services-investment-license',
  title: 'Services Investment License',
  type: 'Investment License',
  size: '4.6 MB',
  file: servicesInvestmentLicensePdf,
  description:
    'Official Services Investment License issued by the Saudi Ministry of Investment (MISA), authorizing the company to conduct construction, maintenance, infrastructure, industrial, and technical service activities within Saudi Arabia.',
},
{
  id: 'vat-registration-certificate',
  title: 'VAT Registration Certificate',
  type: 'Tax Certificate',
  size: '1.0 MB',
  file: vatRegistrationPdf,
  description:
    'Official VAT Registration Certificate issued by the Zakat, Tax and Customs Authority (ZATCA), confirming the company’s registration for Value Added Tax (VAT) compliance in Saudi Arabia.',
},
];

const Documents = ({ isDedicatedPage }) => {
  const location = useLocation();
  const showHero = isDedicatedPage !== undefined ? isDedicatedPage : location.pathname === '/documents';
  const [downloadStates, setDownloadStates] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleDownload = (doc) => {
  if (downloadStates[doc.id]) return;

  setDownloadStates((prev) => ({
    ...prev,
    [doc.id]: 'loading',
  }));

  setTimeout(() => {
    const link = document.createElement('a');

    link.href = doc.file;
    link.download = `${doc.title}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadStates((prev) => ({
      ...prev,
      [doc.id]: 'done',
    }));

    setTimeout(() => {
      setDownloadStates((prev) => {
        const updated = { ...prev };
        delete updated[doc.id];
        return updated;
      });
    }, 3000);
  }, 1000);
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
                      onClick={() => handleDownload(doc)}
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
