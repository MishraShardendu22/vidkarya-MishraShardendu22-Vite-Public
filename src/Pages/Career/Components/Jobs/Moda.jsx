import React from 'react';
import parse from 'html-react-parser';
import modal from '../UI/Modal.module.css';

const color = {
  orange: '#F97316',
};

const JobDescriptionModal = ({ description, onClose }) => {
  if (!description) return null;
  return (
    <>
      <div className={modal.overlay} onClick={onClose} />
      <div className={modal.dialog}>
        <div className={modal.panel} role="dialog" aria-modal="true" aria-label="Job Description">
          <h2 className={modal.title}>Job Description</h2>
          <div className={modal.body}>{parse(description)}</div>
          <div className={modal.footer}>
            <button onClick={onClose} className={modal.closeBtn}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescriptionModal;
