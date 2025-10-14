import React, { useState } from 'react';
import { RiArrowDropDownLine, RiArrowDropUpLine } from '../../lib/icons';
import { AppStates } from '../../Context/appContext.jsx';
import Button from '@mui/material/Button';
import './notes.css';

function NotesFilterCard({ filterName, options }) {
  const { filter, setfilter } = AppStates();
  const [openOptions, setOpenOptions] = useState(true);
  const [checkedState, setCheckedState] = useState(new Array(options.length).fill(false));
  const [expanded, setExpanded] = useState(false);
  const truncatedContent = expanded ? options : options.slice(0, 3);

  const handleCheckBoxChange = async (idx) => {
    const newState = checkedState.map((item, i) => {
      return i === idx ? !item : item;
    });
    setCheckedState(newState);

    const newFilter = options.filter((opt, i) => newState[i] === true);
    setfilter({ ...filter, [filterName]: newFilter });
  };

  return (
    <div className="filter-card">
      <div className="filter-divider"></div>

      {/* HEADER */}
      <div
        className="filter-header"
        onClick={() => setOpenOptions(!openOptions)}
      >
        <p className="filter-title">{filterName}</p>
        <div className="filter-icon">
          {openOptions ? <RiArrowDropUpLine size={30} /> : <RiArrowDropDownLine size={30} />}
        </div>
      </div>

      {/* FILTER OPTIONS */}
      <div className={`filter-options ${openOptions ? 'visible' : 'hidden'}`}>
        {truncatedContent.map((ele, i) => {
          return (
            <div className="filter-option" key={i}>
              <input
                type="checkbox"
                checked={checkedState[i]}
                onChange={() => handleCheckBoxChange(i)}
                className="filter-checkbox"
                name={ele}
                id={`filter-${filterName}-${i}`}
              />

              {filterName === 'Uploaded' ? (
                <label htmlFor={`filter-${filterName}-${i}`} className="filter-label">
                  {`Last ${ele} month`}
                </label>
              ) : filterName === 'Rating' ? (
                <label htmlFor={`filter-${filterName}-${i}`} className="filter-label">
                  {ele}+ ⭐
                </label>
              ) : (
                <label htmlFor={`filter-${filterName}-${i}`} className="filter-label">
                  {ele}
                </label>
              )}
            </div>
          );
        })}

        {/* SHOW MORE BUTTON */}
        {options.length > 3 && (
          <div className="filter-button-container">
            <Button 
              variant="text" 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              className="filter-button"
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesFilterCard;