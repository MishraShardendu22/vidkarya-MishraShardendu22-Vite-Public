import { useState } from 'react';
import styles from './styles/myProjects.module.css';
import MyProjectCard from './MyProjectCard';
import ProjectDetails from './ProjectDetails';

export default function MyProjects({ projects }) {
  // For viewing details of a particular project
  // stores index of 'projects[]' array
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      {selectedProject === null ? (
        // Show All Projects Posted by me
        <div className={styles.projPageWrapper}>
          {projects?.length != 0 ? (
            <div className={styles.projCardsWrapper}>
              {projects.map((projectData, idx) => {
                return (
                  <MyProjectCard
                    key={idx}
                    index={idx}
                    projectData={projectData}
                    setSelectedProject={setSelectedProject}
                  />
                );
              })}
            </div>
          ) : (
            <div className={styles.loadingContainer}>
              <span className={styles.loadingText}>
                Oops ! Looks like you have not posted any project...
              </span>
            </div>
          )}
        </div>
      ) : (
        // Show Expanded details of any single project (also, pass data of that project)
        <ProjectDetails
          project={projects[selectedProject]}
          setSelectedProject={setSelectedProject}
        />
      )}
    </>
  );
}
