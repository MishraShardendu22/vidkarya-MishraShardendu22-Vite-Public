import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar, ProjectCard, ProjectsFilterPanel } from '../../Components';
import { BsFilterLeft, RiArrowDropDownLine } from '../../lib/icons';
import { PROJECT_ASSET } from '../../Assets/assetImages';
// import searchIcon from '../../Assets/Images/Project/searchIcon.svg'
import './projectPage.css';
import { PROJECTS, axios } from '../../api';
import { sendReqToServer } from '../../Hooks/useAxios';
import { useToasts } from '../../Components/UI/toast';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { isFilterEmpty, handleProjectSearchAndFilter, handleEnterClick } from '../../Helpers';
import { useDispatch, useSelector } from 'react-redux';
import { set_Projects } from '../../redux/slices/projects-slices';
import { AppStates } from '../../Context/appContext.jsx';
import { ProjectsSkeleton } from '../../Components/index';

function Projects() {
  //redux
  const dispatch = useDispatch();
  const projectsData = useSelector((state) => {
    return state.projects;
  });

  //context and states
  const { filter } = AppStates();

  const [openFilterPanel, setopenFilterPanel] = useState(true);
  const [projectsPages, setProjectsPages] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setloading] = useState(false);
  const [notify] = useToasts();
  const sendRef = useRef(null);

  // fetch projects using pageNo
  const getProjectsFunc = useCallback(async (pageNo) => {
    try {
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: PROJECTS.pagination,
        method: 'POST',
        requestConfig: {
          num: pageNo,
        },
      });
      if (response) return response;
    } catch {
      notify({
        type: 'ERROR',
        message: 'Fetching Projects failed!',
      });
    }
  }, [notify]);

  // Calculate total pg. nos. to be displayed in pagination
  const setPages = (total) => {
    setProjectsPages(Math.ceil(total / 10));
  };

  const handlePagination = async (e, pageNumber) => {
    try {
      let res;
      setloading(true);
      // CASE 1: Searching or filter
      if (searchTerm.length > 1 || !isFilterEmpty(filter)) {
        res = await handleProjectSearchAndFilter(searchTerm, filter, pageNumber);
      }

      // CASE 2: No Filter/Search is active
      else {
        res = await getProjectsFunc(pageNumber);
      }
      setloading(false);
      // Update projects
      dispatch(set_Projects(res?.body?.currentProjectsPatch));
      setPages(res?.body?.totalProjects);
    } catch (err) {
      setloading(false);
      console.log(err);
    }
  };

  // Default (on new arrival)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const data = await getProjectsFunc(1);
        setloading(false);
        // Set projects data
        dispatch(set_Projects(data?.body?.currentProjectsPatch));
        setPages(data?.body?.totalProjects);
      } catch {
        
        setloading(false);
        notify({
          type: 'ERROR',
          message: 'Some Projects could not be fetched !',
        });
      }
    };

    fetchData();
  }, [getProjectsFunc, dispatch, notify]);

  // On filter change
  useEffect(() => {
    async function handleFilterChange() {
      try {
        setloading(true);
        const res = await handleProjectSearchAndFilter(searchTerm, filter, 1);
        setloading(false);
        // Update projects
        dispatch(set_Projects(res.body.currentProjectsPatch));
        setPages(res.body.totalProjects);
      } catch (err) {
        console.log(err);
        setloading(false);
        notify({
          type: 'ERROR',
          message: 'Some projects could not be fetched !',
        });
      }
    }

    handleFilterChange();
  }, [filter, dispatch, notify, searchTerm]);

  return (
    <>
      <Navbar />
      <div className="projectPageWrapper">
        {/* F I L T E R   &   S O R T */}
        <div className="col-span-1 sticky">
          <div className="flex gap-4 mt-4 ml-2 filter-box sort-filter-options">
            <Button
              variant="outlined"
              size="large"
              className="filter-btn"
              startIcon={<BsFilterLeft />}
              onClick={() => {
                setopenFilterPanel(!openFilterPanel);
              }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="sortBtn"
              disabled
              endIcon={<RiArrowDropDownLine />}
            >
              Sort
            </Button>
          </div>

          {openFilterPanel && <ProjectsFilterPanel />}
        </div>

        <div className="projectPageMain">
          {/* TOP BAR */}
          <div className="projectPageTop">
            <div className="projPageSearch">
              <input
                type="text"
                value={searchTerm}
                onKeyDown={(e) => handleEnterClick(e, sendRef)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === '') handlePagination(e, 1);
                }}
                placeholder="Search Projects"
                className="projPageInput"
              />
              <img
                src={PROJECT_ASSET.search}
                ref={sendRef}
                onClick={(e) => handlePagination(e, 1)}
                alt=""
                className="projPageSearchBtn"
              />
            </div>
          </div>

          {/*   P R O J E C T S    */}

          {loading ? (
            <ProjectsSkeleton />
          ) : (
            <div className="projectsWrapper">
              {projectsData.length !== 0 ? (
                <div className="projectCards">
                  {projectsData.map((project) => {
                    return <ProjectCard key={project._id} project={project} />;
                  })}
                </div>
              ) : (
                <div className="loadingContainer">
                  <span className="loadingText">No projects found . . .</span>
                </div>
              )}

              <div className="flex justify-center p-1 my-2">
                <Pagination count={projectsPages} color="primary" onChange={handlePagination} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Projects;
