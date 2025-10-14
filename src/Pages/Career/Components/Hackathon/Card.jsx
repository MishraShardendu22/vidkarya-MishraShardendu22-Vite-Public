import React from 'react';
import { FaCalendar, FaExternalLinkAlt, FaMapMarkerAlt, FaClock, FaTrophy } from 'react-icons/fa';
import styles from './HackathonCard.module.css';

const color = {
  orange: '#F97316',
  green: '#38B5AA',
};

const HackathonCard = ({ hackathon, index }) => {
  const calculateDaysLeft = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start - today;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  };

  return (
    <div className={styles.card}>
      <div className={styles.sideAccent} style={{ backgroundColor: color.orange, [index % 2 === 0 ? 'left' : 'right']: 0 }} />
      <div className={styles.content}>
        <h2 className={styles.title}>{hackathon.title}</h2>
        <p className={styles.desc}>{hackathon.theme}</p>
        <div className={styles.divider} />
        <div className={styles.row}>
          <div>
            <div className={styles.metaGrid}>
              <div className={styles.meta}>
                <FaMapMarkerAlt className="w-5 h-5" style={{ color: color.green }} />
                <span>{hackathon.location || 'N/A'}</span>
              </div>
              <div className={styles.meta}>
                <FaCalendar className="w-5 h-5" style={{ color: color.green }} />
                <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
              </div>
              {hackathon.prizes.map((prize, index) => (
                <div key={index} className={styles.meta}>
                  <FaTrophy className="w-5 h-5" style={{ color: color.green }} />
                  <p>{prize}</p>
                </div>
              ))}
              <div className={styles.meta}>
                <FaClock className="w-5 h-5" style={{ color: color.green }} />
                <span>{calculateDaysLeft(hackathon.startDate)} days left</span>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <a href={hackathon.problemStatementLink} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              <span>Register</span>
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.credits}>{hackathon.source} - credit</div>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
