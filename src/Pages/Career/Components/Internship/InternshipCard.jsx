import React from 'react';
import { FaMapMarkerAlt, FaCalendar, FaExternalLinkAlt } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import Skeleton from '../Skeleton';
import styles from './InternshipCard.module.css';

const color = {
  orange: '#F97316',
  green: '#38B5AA',
};

const InternshipCard = ({ internship, onViewDescription, cardIndex, loading }) => {
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
      <div className={styles.sideAccent} style={{ background: color.orange, left: isEven ? 0 : 'auto', right: isEven ? 'auto' : 0 }} />
      <div className={styles.content}>
        <div className="mb-6 text-center">
          <h2 className={styles.title} style={{ color: color.green }}>
            {internship.title} - {internship.company}
          </h2>
        </div>
        <div className="mb-2">
          <p className={styles.about}>{internship.about || ''}</p>
        </div>
        <div className={styles.tags}>
          {internship.mode && <span className={styles.tag}>{internship.mode}</span>}
          {internship.type && <span className={`${styles.tag} ${internship.type?.toLowerCase() === 'unpaid' ? styles.tagWarn : ''}`}>{internship.type}</span>}
          {internship.duration && <span className={styles.tag}>{internship.duration}</span>}
        </div>
        <div className={styles.metaGrid}>
          <div className={styles.meta}>
            <FaMapMarkerAlt className="w-5 h-5" style={{ color: color.green }} />
            <span className="text-sm">{internship.location || 'N/A'}</span>
          </div>
          <div className={styles.meta}>
            <BiMoneyWithdraw className="w-5 h-5" style={{ color: color.green }} />
            <span className="text-sm">{internship.stipend || 'Unpaid'}</span>
          </div>
          <div className={styles.meta}>
            <FaCalendar className="w-5 h-5" style={{ color: color.green }} />
            <span className="text-sm">{new Date(internship.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.credits}>{internship.source} - credit</div>
          <div className={styles.actions}>
            <button onClick={() => onViewDescription(internship.description)} className={styles.btnOutline}>View Description</button>
            <a href={internship.applicationLink} target="_blank" rel="noopener noreferrer" className={styles.btnSolid}>
              <span>Apply Now</span>
              <FaExternalLinkAlt className="w-4 h-4" style={{ marginLeft: 8 }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
