import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { Autocomplete } from '@mui/material';
import './applyProject.css';
import skillsList from '../../data/skillsList';
import { sendReqToServer } from '../../Hooks/useAxios';
import { useToasts } from './../../Components/UI/toast';
import { axios, PROJECTS } from '../../api';
import { AppStates } from '../../Context/appContext.jsx';

const ApplyProject = ({ isOpen, closePopup, project }) => {
  const { user } = AppStates();
  const [notify] = useToasts();
  const [link, setLink] = useState('');
  const [about, setAbout] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillChange = (event, newSkills) => {
    setSelectedSkills(newSkills);
  };

  async function handleApply() {
    // Case: Applicant is the Owner
    if (user._id === project?.owner?._id) {
      notify({
        type: 'INFO',
        message: "You can't apply to your own Project",
      });
      return;
    }

    //Case: Required Details are not filled
    if (!about.length || !selectedSkills.length) {
      notify({
        type: 'INFO',
        message: 'Please fill the required details',
      });
      return;
    }

    try {
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: PROJECTS.apply,
        method: 'POST',
        requestConfig: {
          projectid: project._id,
          userid: user._id,
          about: about,
          skills: selectedSkills,
          link: link,
        },
      });

      if (response) {
        notify({
          type: 'PROMISE',
          message: response.message,
        });
      }
      closePopup();
    } catch (err) {
      closePopup();
      console.error(err);
      notify({
        type: 'ERROR',
        message: 'Error in Applying',
      });
    }
  }

  return (
    <div className={`apply_popup ${isOpen ? 'open' : ''}`}>
      <div className="project-add-section">
        <Paper
          elevation={3}
          sx={{
            marginRight: '15%',
            marginLeft: '15%',
            justifyContent: 'center',
            borderRadius: '20px',
          }}
        >
          <Box sx={{ padding: 5 }}>
            <Typography
              className="project-add-title"
              variant="h5"
              gutterBottom
              sx={{ paddingBottom: 5, fontWeight: '600' }}
            >
              Apply For Project
              <hr />
            </Typography>

            <Grid container spacing={3}>
              {/* Project Name */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  Project Name
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="projectName"
                  name="projectName"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  disabled
                  value={project.name}
                />
              </Grid>

              {/* user Name */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  Name
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="title"
                  name="title"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  disabled
                  value={user.name}
                />
              </Grid>

              {/* About */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  About You
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="outlined-multiline-static"
                  required
                  // label="About You"
                  multiline
                  fullWidth
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </Grid>

              {/* Link */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  Link
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="title"
                  name="link"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  label="LinkedIn / Resume link (optional)"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Grid>

              {/* Skills */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  Your Skills
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Autocomplete
                  multiple
                  required
                  id="skills-input"
                  options={skillsList}
                  freeSolo
                  value={selectedSkills}
                  onChange={handleSkillChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Skills"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={4} />

              {/* submit section */}
              <Grid item xs={12} sm={4} />
              <Grid className="project-add-submit-container" item xs={12} sm={5}>
                <Button
                  className="project-add-custom-button1"
                  onClick={handleApply}
                  variant="contained"
                  fullWidth
                >
                  Apply
                </Button>
                <Button
                  className="project-add-custom-button2"
                  variant="contained"
                  fullWidth
                  onClick={closePopup}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default ApplyProject;
