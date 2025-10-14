import React from 'react';
import styles from './CategoryCard.module.css';

const palette = {
  orange: '#F97316',
  green: '#38B5AA',
};

const CategoryCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button className={styles.card} onClick={onClick} aria-label={`View ${title}`}>
      <div className={styles.iconWrap} style={{ background: `${palette.green}15` }}>
        <Icon size={28} color={palette.green} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
      <div className={styles.cta} style={{ color: palette.orange }}>View More →</div>
    </button>
  );
};

export default CategoryCard;


