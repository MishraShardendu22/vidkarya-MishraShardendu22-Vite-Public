import React from 'react';
import { FaMapMarkerAlt, FaCalendar, FaExternalLinkAlt, FaBuilding } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import Skeleton from '../Skeleton';
import styles from './JobCard.module.css';

const color = {
  orange: '#F97316',
  green: '#38B5AA',
};

const JobCard = ({ Job, onViewDescription, cardIndex, loading }) => {
  const isEven = cardIndex % 2 === 0;
  if (loading)
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    );

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.side} style={{ left: isEven ? 0 : 'auto', right: isEven ? 'auto' : 0 }} />
        <h2 className={styles.title}>{Job.title}</h2>
        <p className={styles.about}>{Job.about || ''}</p>
        <div className={styles.metaGrid}>
          <div className={styles.meta}>
            <FaMapMarkerAlt className="w-5 h-5" style={{ color: color.green }} />
            <span>{Job.location || 'N/A'}</span>
          </div>
          <div className={styles.meta}>
            <BiMoneyWithdraw className="w-5 h-5" style={{ color: color.green }} />
            <span>{Job.salary || 'Unpaid'}</span>
          </div>
          <div className={styles.meta}>
            <FaCalendar className="w-5 h-5" style={{ color: color.green }} />
            <span>{new Date(Job.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.meta}>
            <FaBuilding className="w-5 h-5" style={{ color: color.green }} />
            <span>{Job.company}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.credits}>{Job.source} - credit</div>
          <div className={styles.actions}>
            <button onClick={() => onViewDescription(Job.description)} className={styles.btnOutline}>View Details</button>
            <a href={Job.applicationLink} target="_blank" rel="noopener noreferrer" className={styles.btnSolid}>
              <span>Apply Now</span>
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
