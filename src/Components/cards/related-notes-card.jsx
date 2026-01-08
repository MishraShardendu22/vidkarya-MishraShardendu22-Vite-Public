import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical, AiOutlineEye } from '../../lib/icons';
import NotesOptionBox from '../Notes/notes-options-box';
// import sampleNotesPic from "../../Assets/Images/Notes/notes-carousel.svg"
import { NOTES_ASSET } from '../../Assets/assetImages';
import { useNavigate } from 'react-router-dom';

export default function RelatedNotesCard({
  notesData,
  setNotesData,
  user,
  setuser,
  reletedNotesOptionBox,
  setReletedNotesOptionBox,
}) {
  const [openOptionsBox, setopenOptionsBox] = useState(false);
  const navigate = useNavigate();
  const optionsBoxRef = useRef(null);

  const handleNotes = () => {
    navigate(`/notes/preview/${notesData._id}`);
    window.location.reload();
  };

  useEffect(() => {
    // Function to handle the click event outside the popup component
    const handleClickOutside = (event) => {
      if (optionsBoxRef.current && !optionsBoxRef.current.contains(event.target)) {
        setopenOptionsBox(false);
        setReletedNotesOptionBox('');
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setReletedNotesOptionBox]);
  return (
    <div
      className="flex gap-3 border shadow rounded-md p-1 my-1  w-full cursor-pointer"
      onClick={handleNotes}
    >
      <div className="w-[45%] flex items-center">
        <img src={notesData.thumbnailUrl} alt="" className="object-fill p-2 w-full h-[7em]" />
      </div>

      <div className="notes-info p-1 w-full text-sm">
        <div className="flex justify-between relative">
          <p className="font-medium text-lg" ref={optionsBoxRef}>
            {notesData.name}
          </p>
          <BsThreeDotsVertical
            size={20}
            className="cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              setopenOptionsBox(!openOptionsBox);
              setReletedNotesOptionBox(notesData._id);
            }}
          />
          {openOptionsBox && reletedNotesOptionBox === notesData._id && (
            <NotesOptionBox
              notesData={notesData}
              setNotesList={setNotesData}
              user={user}
              setuser={setuser}
            />
          )}
        </div>

        <p className="">
          {notesData.branch.toString()} | {notesData.college}{' '}
        </p>
        <p className="font-thin">Anonymous</p>

        <div className="flex my-1 items-center gap-2 text-sm">
          <AiOutlineEye size={18} />
          <span>{notesData.views} views</span>
        </div>
      </div>
    </div>
  );
}
