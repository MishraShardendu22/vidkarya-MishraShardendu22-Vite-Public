import React, { useEffect, useState, useCallback } from 'react';
import styles from './styles/projDetails.module.css';
import { IoArrowBack } from 'react-icons/io5';
import ApplicantCard from './ApplicantCard';

export default function ProjectDetails(props) {
  const { project, setSelectedProject } = props;

  const [applicants, setApplicants] = useState([]);
  const [selectedList, setSelectedList] = useState('APPLIED');

  // Filter applicants with given 'status'
  const getApplications = useCallback((status) => {
    const filteredApplication = project.applications.filter((ele) => {
      return ele.applicantStage === status;
    });

    return filteredApplication;
  }, [project.applications]);

  useEffect(() => {
    setApplicants(getApplications(selectedList));
  }, [project, selectedList, getApplications]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headingText}> {project.name} </div>

      {/* NAVBAR */}
      <div className={styles.navWrapper}>
        {/* Back Button */}
        <div className={styles.goBackBtn} onClick={() => setSelectedProject(null)}>
          <IoArrowBack size={25} />
        </div>

        <div className={styles.nav}>
          <div
            className={`${styles.navBtn} ${selectedList === 'APPLIED' && styles.navBtnClicked}`}
            onClick={() => setSelectedList('APPLIED')}
          >
            Applicants{' '}
          </div>
          <div
            className={`${styles.navBtn} ${selectedList === 'SHORTLISTED' && styles.navBtnClicked}`}
            onClick={() => setSelectedList('SHORTLISTED')}
          >
            Shortlisted{' '}
          </div>
          <div
            className={`${styles.navBtn} ${selectedList === 'ACCEPTED' && styles.navBtnClicked}`}
            onClick={() => setSelectedList('ACCEPTED')}
          >
            Accepted{' '}
          </div>
          {/* <div 
            className={`${styles.navBtn} ${selectedList=="REJECTED" && styles.navBtnClicked}`} 
            onClick={(e)=> setSelectedList("REJECTED")}
          > 
          Rejected </div> */}
        </div>
      </div>

      <div className={styles.applicationList}>
        {applicants.length != 0 ? (
          applicants.map((ele, idx) => {
            return <ApplicantCard key={idx} applicationData={ele} />;
          })
        ) : (
          <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>
              Oops ! Nobody has {selectedList != 'APPLIED' && 'been'} {selectedList.toLowerCase()}{' '}
              yet.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
