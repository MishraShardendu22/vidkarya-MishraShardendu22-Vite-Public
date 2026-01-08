import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/courseStrPreview.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { Navbar } from '../../Components';
import { arrayToStr } from '../../Helpers/utilFunctions';
import { FaLink } from 'react-icons/fa6';

function CourseStrPreview() {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState();
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        setIsLoding(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/courseStructure/get/${courseId}`
        );
        if (res?.data?.body) {
          setCourseDetails(res.data.body.courseStructure);
        }
        setIsLoding(false);
      } catch (err) {
        setIsLoding(false);
        console.log(err);
        throw err;
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  // Scroll to Top
  useEffect(() => {
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    scrollToTop();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.wrapper}>
        <span className={styles.courseHead}>
          {`${courseDetails?.courseCode} : ${courseDetails?.courseName}`}
        </span>

        <hr className={styles.line} />

        <span className={styles.courseDesc}>
          <b> Instructor: </b> {courseDetails?.instructor}
        </span>

        <span className={styles.courseDesc}>
          <b> Teaching Assistant(s): </b> {arrayToStr(courseDetails?.assistants)}
        </span>

        <span className={styles.courseDesc}>
          <b> Prerequisites: </b> {arrayToStr(courseDetails?.prerequisites)}
        </span>

        <span className={styles.courseDesc}>
          <b> Floated since: </b> {courseDetails?.floatedSince}
        </span>
        <br />

        <span className={styles.courseDesc}>
          <b> About: </b> {courseDetails?.description}
        </span>
        <br />

        <span className={styles.courseDesc}>
          <b> Text References: </b>
          <br />
          {courseDetails?.references.map((ele, index) => {
            return (
              <span key={index}>
                {' '}
                {ele} <br />{' '}
              </span>
            );
          })}
        </span>
        <br />

        <span className={styles.courseDesc}>
          <b>
            {' '}
            Evaluation Scheme: <br />{' '}
          </b>{' '}
          {courseDetails?.evaluationScheme}
        </span>
        <br />

        <span className={styles.courseDesc}>
          <b>
            {' '}
            Audit Requirements: <br />{' '}
          </b>{' '}
          {courseDetails?.aduitRequirements}
        </span>
        <br />

        <span className={styles.prevYearPapers}>
          <div to={`/prevYearPapers/${courseDetails?._id}`}>
            <b style={{ cursor: 'not-allowed' }}> Previous Year Papers </b>
          </div>
          <FaLink className={styles.linkIcon} />
        </span>
        <br />
      </div>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 5,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default CourseStrPreview;
