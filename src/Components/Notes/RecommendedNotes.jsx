import React, { useState, useEffect } from 'react';
import './notes.css';
import dummyNotesData from '../../Assets/DummyData/recNotesData.js';
import NotesCardMini from './NotesCardMini';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from 'react-icons/io';
import { sendReqToServer } from '../../Hooks/useAxios';
import { NOTES, axios } from '../../api';
import { AppStates } from '../../Context/appContext.jsx';
import { useToasts } from '../UI/toast';

function RecommendedNotes() {
  // For maintaining list of notes to be viewed for each category
  const [NotesData, setNotesData] = useState(dummyNotesData);
  const [recNotes, setrecNotes] = useState([]);
  const [category, setcategory] = useState(null);
  const { user: _user } = AppStates();
  const [notify] = useToasts();

  const [visibleCards, setVisibleCards] = useState(5);

  const _handleClickNext = () => {
    setVisibleCards((prevVisibleCards) => Math.min(prevVisibleCards + 5, NotesData.length));
  };

  const _handleClickPrevious = () => {
    setVisibleCards((prevVisibleCards) => Math.max(prevVisibleCards - 5, 5));
  };
  const _fetchTopRated = () => {
    const updatedList = [...dummyNotesData];
    updatedList.sort((a, b) => {
      return b.rating - a.rating;
    });
    setNotesData(updatedList);
  };

  const _fetchLatest = () => {
    const updatedList = [...dummyNotesData];
    updatedList.sort((a, b) => {
      return parseInt(b.time) - parseInt(a.time);
    });
    setNotesData(updatedList);
  };

  const _fetchMostViewed = () => {
    const updatedList = [...dummyNotesData];
    updatedList.sort((a, b) => {
      return b.views - a.views;
    });
    setNotesData(updatedList);
  };

  // fetch notes when the top category changes
  useEffect(() => {
    //fetch top category notes
    const fetchTopCategoryNotes = async () => {
      if (!category) return;

      try {
        const { response, error: _error1 } = await sendReqToServer({
          axiosInstance: axios,
          url: NOTES.getTopCategory,
          method: 'POST',
          requestConfig: {
            category: category,
          },
        });

        if (response) {
          setrecNotes(response.body);
        }
      } catch (e) {
        console.log(e);
        notify({
          type: 'ERROR',
          message: 'something went wrong in fetching notes',
        });
      }
    };

    fetchTopCategoryNotes();
  }, [category, notify]);

  useEffect(() => {
    //fetching random reommanded notes
    const getRecommandedNotes = async () => {
      try {
        const { response, error: _error2 } = await sendReqToServer({
          axiosInstance: axios,
          url: NOTES.getRecommandedNotes,
          method: 'GET',
        });

        if (response) {
          setrecNotes(response.body);
          // console.log(response);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getRecommandedNotes();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="RecommendedNotesSection">
          {/* REC NOTES TEXT */}
          <div className="RecNotesText">
            <h1 className="RecNotesTextHeading">Our recommended notes</h1>
            <p className="RecNotesTextPara">
              Discover our highly acclaimed, widely recognized, and top-quality recommended notes
              for exceptional content.
            </p>
          </div>

          {/* N O T E S */}
          <div className="RecommendedNotesWrapper">
            {/* REC NAVBAR */}
            <div className="RecNotesNavBar">
              <button className="RecNotesTopRatedBtn" onClick={() => setcategory('rating')}>
                Top Rated
              </button>
              <button className="RecNotesNewBtn" onClick={() => setcategory('createdAt')}>
                Latest
              </button>
              <button className="RecNotesMostViewedBtn" onClick={() => setcategory('views')}>
                Most Viewed
              </button>
            </div>

            <div className="RecNotescardsWrapper">
              <div className="recNotesContainer">
                {recNotes.map((ele, idx) => {
                  return (
                    <NotesCardMini
                      {...ele}
                      key={idx}
                      className={`${idx < visibleCards ? 'visibleCard' : ''}`}
                    />
                  );
                })}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecommendedNotes;
