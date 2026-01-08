import React, { useEffect, useRef } from 'react';
import { BsThreeDotsVertical, RiDeleteBinLine } from '../lib/icons';
import { NotesDetailsContext } from './../Context/notesContextApi.jsx';

const defaultDPLink =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHQv_th9wq3ivQ1CVk7UZRxhbPq64oQrg5Q&usqp=CAU';

const CommentOptionBox = ({ commentId: _commentId }) => {
  return (
    <>
      <div
        className="cursor-pointer flex justify-between gap-2 items-center shadow absolute z-30 bg-white p-2 rounded right-[3rem] border text-sm"
        onClick={(event) => {
          event.stopPropagation();
          // handelDeleteButton();
        }}
      >
        <RiDeleteBinLine size={25} />
        <div>Delete</div>
      </div>
    </>
  );
};

export default function Comment({
  data,
  comment,
  user,
  commentId,
  setCommentId,
  commentOpenOptionsBox,
  setCommentOpenOptionsBox,
}) {
  const dpLink = data.dpLink || defaultDPLink;
  const commentOptionsBoxRef = useRef(null);
  const _id = comment?._id;

  // console.log(comment)

  // const [openOptionBox, setOpenOptionBox] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentOptionsBoxRef.current && !commentOptionsBoxRef.current.contains(event.target)) {
        setCommentOpenOptionsBox(false);
        setCommentId('');
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setCommentOpenOptionsBox, setCommentId]);
  return (
    <div className="flex gap-2 justify-between my-4 items-center">
      <img src={dpLink} alt="" className="w-9 h-9  rounded-full object-cover" />

      <p className="text-sm w-3/4" ref={commentOptionsBoxRef}>
        {comment.content}
      </p>
      <BsThreeDotsVertical
        className="cursor-pointer"
        size={18}
        onClick={(event) => {
          event.stopPropagation();
          setCommentOpenOptionsBox(!commentOpenOptionsBox);
          setCommentId(_id);
        }}
      />
      {commentOpenOptionsBox && _id === commentId && user._id === comment?.userId._id && (
        <CommentOptionBox commentId={commentId} />
      )}
    </div>
  );
}
