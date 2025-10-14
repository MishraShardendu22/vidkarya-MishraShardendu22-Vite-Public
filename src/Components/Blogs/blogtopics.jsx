import React from 'react';
import { Grid, Card } from '@mui/material';
import topics from './BlogTopics_Details';
import './blogs.css';

const Blogtopics = () => {
  return (
    <>
      <p className="mainHeading">Content you might dive deep </p>

      <Grid className="mainContainer1" container spacing={2}>
        {topics.map((topic) => {
          return (
            <Grid item lg={3} key={topic.id}>
              <Card className="topicCard">
                <div className="topicIcon">
                  <img
                    src={topic.icon}
                    alt="topic_image"
                    style={{ height: '70px', width: '70px' }}
                  />
                </div>

                <div className="topicTitle">{topic.title}</div>

                <div className="topicDescription">{topic.description}</div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Blogtopics;
