import React from 'react';
import modal from './Modal.module.css';

const palette = { orange: '#F97316', green: '#38B5AA' };

const Row = ({ primary, secondary, meta }) => (
  <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ fontWeight: 700, color: '#111827' }}>{primary}</div>
    {secondary && <div style={{ color: '#374151', marginTop: 2 }}>{secondary}</div>}
    {meta && <div style={{ color: '#6b7280', marginTop: 4, fontSize: 12 }}>{meta}</div>}
  </div>
);

const QuickPeekModal = ({ open, type, items, onClose, onGo }) => {
  if (!open) return null;

  const titleMap = {
    hackathon: 'Latest Hackathons',
    internship: 'Latest Internships',
    jobs: 'Latest Job Listings',
  };

  const renderRow = (item) => {
    if (type === 'hackathon') {
      return (
        <Row
          primary={item.title}
          secondary={item.theme}
          meta={`${new Date(item.startDate).toLocaleDateString()} • ${item.location || 'N/A'}`}
        />
      );
    }
    if (type === 'internship') {
      return (
        <Row
          primary={`${item.title} — ${item.company}`}
          secondary={item.about}
          meta={`${item.location || 'N/A'} • ${item.duration || ''} • ${item.type || ''}`}
        />
      );
    }
    return (
      <Row
        primary={`${item.title} — ${item.company}`}
        secondary={item.about}
        meta={`${item.location || 'N/A'} • ${item.salary || ''}`}
      />
    );
  };

  return (
    <>
      <div className={modal.overlay} onClick={onClose} />
      <div className={modal.dialog}>
        <div className={modal.panel} role="dialog" aria-modal="true" aria-label="Quick preview">
          <h2 className={modal.title}>{titleMap[type] || 'Preview'}</h2>
          <div className={modal.body}>
            {(!items || items.length === 0) && <div style={{ color: '#6b7280' }}>Loading…</div>}
            {items && items.slice(0, 4).map((it) => (
              <div key={it._id || it.id}>{renderRow(it)}</div>
            ))}
          </div>
          <div className={modal.footer}>
            <button onClick={onGo} className={modal.closeBtn} style={{ background: palette.green }}>Open Full Page</button>
            <button onClick={onClose} className={modal.closeBtn} style={{ marginLeft: 8, background: palette.orange }}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickPeekModal;


