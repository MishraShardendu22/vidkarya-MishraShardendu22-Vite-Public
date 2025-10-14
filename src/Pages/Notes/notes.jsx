import { useEffect, useState, useCallback } from 'react';
import {
  Navbar,
  NotesCard,
  NotesNavbar,
  NotesCarousel,
  RecommendedNotes,
  NotesFilterPanel,
} from '../../Components';
import { sendReqToServer } from '../../Hooks/useAxios';
import { NOTES, axios } from '../../api';
import './notes.css';
import { BsFilterLeft, MdCancel, RiArrowDropDownLine } from '../../lib/icons';
import Pagination from '@mui/material/Pagination';
import { useToasts } from '../../Components/UI/toast';
import { slides } from '../../data/notesCarousel';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { set_Notes, addNote as _addNote } from '../../redux/slices/notes-slices';
import { AppStates } from '../../Context/appContext.jsx';
import { handleNotesSearchAndFilter, isFilterEmpty as _isFilterEmpty } from '../../Helpers/index';
import { NOTES_ASSET } from '../../Assets/assetImages';
import NotesSkeleton from '../../Components/loading-skeletons/notes-skeleton';

export default function Notes() {
  const dispatch = useDispatch();
  const notesData = useSelector((state) => state.notes); // FIX: Get from Redux
  
  const [notify] = useToasts();
  const { filter, setfilter } = AppStates();
  const [_pageNo, _setpageNo] = useState(1);
  const [loading, setloading] = useState(false);
  const [notesPages, setNotespages] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setisSearched] = useState(false);
  const [finalSearchTerm, setfinalSearchTerm] = useState('');
  const [openFilterPanel, setopenFilterPanel] = useState(true);

  const getNotesFunc = useCallback(async (index) => {
    try {
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: NOTES.pagination,
        method: 'POST',
        requestConfig: {
          num: index,
        },
      });
      if (response) return response;
    } catch {
      notify({
        type: 'ERROR',
        message: 'Fetching Notes failed!',
      });
    }
  }, [notify]);

  const setPages = (total) => {
    setNotespages(Math.ceil(total / 10));
  };

  useEffect(() => {
    setloading(true);
    const fetchNoteForFilterAndSearchChange = async () => {
      try {
        const data = await handleNotesSearchAndFilter(filter, searchTerm, 1);
        dispatch(set_Notes(data.body.currentNotesPatch));
        setPages(data.body.totalNotes);
        setloading(false);
      } catch {
        setloading(false);
        notify({
          type: 'ERROR',
          message: 'Some notes could not be fetched !',
        });
      }
    };
    fetchNoteForFilterAndSearchChange();
    setisSearched(false);
  }, [filter, searchTerm, dispatch, notify]);

  const handlePagenation = async (event, pageNumber) => {
    try {
      _setpageNo(pageNumber);
      setloading(true);
      const res = await handleNotesSearchAndFilter(filter, searchTerm, pageNumber);
      setloading(false);
      dispatch(set_Notes(res.body.currentNotesPatch));
      setPages(res.body.totalNotes);
    } catch (err) {
      setloading(false);
      console.log(err);
    }
  };

  const onSearchClick = async (e, click) => {
    try {
      if (e.key === 'Enter' || click) {
        setisSearched(true);
        setfinalSearchTerm(searchTerm);
        setloading(true);
        const res = await handleNotesSearchAndFilter(filter, searchTerm, 1);
        setloading(false);
        if (res) dispatch(set_Notes(res.body.currentNotesPatch));
        setPages(res.body.totalNotes);
      }
    } catch {
      setloading(false);
      notify({
        type: 'ERROR',
        message: 'Some notes could not be fetched after searching!',
      });
    }
  };

  useEffect(() => {
    setloading(true);
    const fetchData = async () => {
      try {
        const data = await getNotesFunc(1);
        if (data) {
          dispatch(set_Notes(data.body.currentNotesPatch));
          setPages(data.body.totalNotes);
          setloading(false);
        }
      } catch {
        setloading(false);
        notify({
          type: 'ERROR',
          message: 'Some notes could not be fetched !',
        });
      }
    };
    fetchData();
  }, [getNotesFunc, dispatch, notify]);

  const cancelSearch = async () => {
    setSearchTerm('');
    setisSearched(false);
    setfilter({ ...filter, searchTerm: '' });
  };

  return (
    <>
      <Navbar />
      <div>
        <NotesNavbar
          setsearchTerm={setSearchTerm}
          onSearchClick={onSearchClick}
          searchTerm={searchTerm}
        />
        <div className="mx-[2.5rem]">
          <NotesCarousel data={slides} />
          <RecommendedNotes />

          <div className="all-notes-display">
            {/* FILTER & SORT */}
            <div className="filter-sort-section">
              <div className="filter-box">
                <Button
                  variant="outlined"
                  size="large"
                  className="filter-btn"
                  startIcon={<BsFilterLeft />}
                  onClick={() => setopenFilterPanel(!openFilterPanel)}
                >
                  Filters
                </Button>
                <Button
                  disabled
                  variant="outlined"
                  size="large"
                  className="sort-btn"
                  endIcon={<RiArrowDropDownLine />}
                >
                  Sort
                </Button>
              </div>

              {openFilterPanel && (
                <div className="filter-panel-wrapper">
                  <NotesFilterPanel />
                </div>
              )}
            </div>

            {/* NOTES */}
            <div className="notesContainer">
              {isSearched && (
                <div className="notesSub">
                  <p className="noteHead">
                    Search results for <span className="noteSubHead">{finalSearchTerm}</span>
                  </p>
                  <MdCancel
                    className="cancel-btn"
                    size={18}
                    color="red"
                    onClick={cancelSearch}
                  />
                </div>
              )}

              {notesData && notesData.length === 0 && !loading && (
                <div className="imageContainer">
                  <div>
                    <img
                      src={NOTES_ASSET.noData}
                      className="ImageNotFound"
                      alt="not found"
                    />
                    <p className="notFound">Sorry, No results found for your Search</p>
                  </div>
                </div>
              )}

              <div className="notes-wrapper">
                {loading ? (
                  <NotesSkeleton />
                ) : (
                  notesData && notesData.map((note) => <NotesCard key={note._id} note={note} />)
                )}
              </div>

              <div className="pagination">
                <Pagination count={notesPages} color="primary" onChange={handlePagenation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}