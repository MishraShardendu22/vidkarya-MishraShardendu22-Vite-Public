import { useState } from 'react';
import styles from './styles/applicantCard.module.css';
import { convertTimeToMomentsAgo, arrayToStr } from '../../../Helpers';
import { CgSandClock } from 'react-icons/cg';
import { AiOutlineLink } from 'react-icons/ai';
import { VscVscode } from 'react-icons/vsc';
import { BiMailSend } from 'react-icons/bi';
import { NAVBAR_ASSET } from '../../../Assets/assetImages';
// import demoImg from "../../../Assets/Images/Navbar/DefaultUserDP.svg"
import { useDispatch, useSelector } from 'react-redux';
import { set_MyProjects } from '../../../redux/slices/myprojects-slices';
import { sendReqToServer } from '../../../Hooks/useAxios';
import { useToasts } from './../../UI/toast';
import { axios, PROJECTS } from '../../../api';
import StageUpdationDialog from './StageUpdationDialog';

export default function ApplicantCard({ applicationData }) {
  //redux
  const dispatch = useDispatch();
  const myProjects = useSelector((state) => {
    return state.myProjects;
  });

  const [notify] = useToasts();
  const applicationTime = convertTimeToMomentsAgo(applicationData?.createdAt);
  const [openDialog, setOpenDialog] = useState(false);

  async function handleClose(newStage) {
    // Case: No Change => No Updation
    if (newStage === applicationData?.applicantStage) {
      setOpenDialog(false);
      return;
    }

    setOpenDialog(false);

    // Update status in backend
    try {
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: PROJECTS.stageUpdate,
        method: 'PUT',
        requestConfig: {
          newStage: newStage,
          applicationId: applicationData._id,
        },
      });

      // onSuccess
      if (response) {
        notify({
          type: 'PROMISE',
          message: 'Updated Application Status',
        });

        // update status in redux store
        const updatedProjectsData = myProjects.map((proj) => {
          if (proj._id === applicationData.project) {
            const updatedApplications = proj.applications.map((application) => {
              if (application._id === applicationData._id) {
                return { ...application, applicantStage: newStage };
              } else return application; // Keep other applications unchanged
            });

            return { ...proj, applications: updatedApplications };
          } else return proj; // Keep other projects unchanged
        });
        dispatch(set_MyProjects(updatedProjectsData));
      }
    } catch (err) {
      console.error(err);
      notify({
        type: 'ERROR',
        message: 'Error in updation',
      });
    }
  }

  return (
    <div className={styles.CardMain}>
      {/* T O P */}
      <div className={styles.CardTop}>
        <div className={styles.CardTopLeft}>
          <img
            src={
              applicationData?.applicant?.dpLink
                ? applicationData?.applicant.dpLink
                : NAVBAR_ASSET.userLogo
            }
            className={styles.photoURL}
            alt=""
          />

          <div className={styles.CardHead}>
            <div className={styles.CardMainHead}>{applicationData?.applicant.name}</div>
            <div className={styles.CardAuthor}>Applied: {applicationTime}</div>
          </div>
        </div>
      </div>

      {/*  C O N T E N T  */}
      <div className={styles.CardContent}>
        {/* ABOUT THE APPLICANT */}
        <div className={styles.Desctiption}>{applicationData?.about}</div>

        {/* SKILLS */}
        <div className={styles.Details}>
          <VscVscode size={18} className={styles.DetailsLogo} />
          <span className={styles.DetailsHead}>Skills: </span>
          <span className={styles.DetailsDesc}>{arrayToStr(applicationData?.skills)}</span>
        </div>

        {/* EMAIL */}
        <div className={styles.Details}>
          <BiMailSend size={20} className={styles.DetailsLogo} />
          <span className={styles.DetailsHead}>Mail: </span>
          <span className={styles.DetailsDesc}>{applicationData?.applicant?.email}</span>
        </div>

        {/* LINK */}
        <div className={styles.Details}>
          <AiOutlineLink size={23} className={styles.DetailsLogo} />
          <span className={styles.DetailsHead}>Link: </span>
          <a
            href={applicationData?.link ? applicationData.link : '#'}
            target="_blank"
            className={styles.DetailsDesc}
          >
            {' '}
            {applicationData?.link ? applicationData.link : 'N/A'}{' '}
          </a>
        </div>

        {/* STATUS */}
        <div className={styles.Details}>
          <CgSandClock size={22} className={styles.DetailsLogo} />
          <span className={styles.DetailsHead}>Status: {applicationData?.applicantStage}</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className={styles.CardBtns}>
        <button className={styles.updateBtn} onClick={() => setOpenDialog(true)}>
          Update
        </button>
      </div>

      {/* STAGE UPDATION DIALOG */}
      <StageUpdationDialog openDialog={openDialog} handleClose={handleClose} />
    </div>
  );
}
