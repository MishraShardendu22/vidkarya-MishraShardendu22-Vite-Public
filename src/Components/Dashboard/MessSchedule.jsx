import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MessTopCard from './MessTopCard';
import MessCard from './MessCard';
import MessBottomCard from './MessBottomCard';
import Styles from './CSS/MessSchedule.module.css';
import { getJSONFromFirebase } from '../../Helpers';

const MessSchedule = () => {
  const [schedule, setSchedule] = useState({
    previousDay: {},
    currentDay: {},
    nextDay: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleSchedule() {
      try {
        setIsLoading(true);
        // Fetch JSON from firebase
        const MessTimeTable = await getJSONFromFirebase('messSchedule');

        // Check if data exists and is an array
        if (!MessTimeTable || !Array.isArray(MessTimeTable) || MessTimeTable.length === 0) {
          throw new Error('No mess schedule data available');
        }

        // Determine the current day
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const currentDate = new Date();
        const currentDayIndex = currentDate.getDay();
        const currentDayName = daysOfWeek[currentDayIndex];

        // Find the schedules for the current day, previous day, and next day
        const currentDayIndexInData = MessTimeTable.findIndex((item) => item.day === currentDayName);
        
        if (currentDayIndexInData === -1) {
          throw new Error('Current day not found in schedule');
        }

        const previousDayIndex =
          (currentDayIndexInData - 1 + MessTimeTable.length) % MessTimeTable.length;
        const nextDayIndex = (currentDayIndexInData + 1) % MessTimeTable.length;

        setSchedule({
          previousDay: MessTimeTable[previousDayIndex],
          currentDay: MessTimeTable[currentDayIndexInData],
          nextDay: MessTimeTable[nextDayIndex],
        });
      } catch (err) {
        console.error('Failed to fetch mess schedule:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    handleSchedule();
  }, []);

  return (
    <div className={Styles.MessScheduleContainer}>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-600">Loading mess schedule...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-red-600">Unable to load mess schedule</p>
        </div>
      ) : (
        <>
          <Grid container spacing={2} className={Styles.MessTop}>
            {/* MessTopCard components */}
            {schedule.previousDay.meals &&
              schedule.previousDay.meals.map((meal, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} className={Styles.MessCardItem}>
                  <MessTopCard meal={meal} />
                </Grid>
              ))}
          </Grid>

          <Grid container spacing={2} className={Styles.MessMiddle}>
            {/* MessCard components */}
            {schedule.currentDay.meals &&
              schedule.currentDay.meals.map((meal, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} className={Styles.MessCardItem}>
                  <MessCard meal={meal} />
                </Grid>
              ))}
          </Grid>

          <Grid container spacing={2} className={Styles.MessBottom}>
            {/* MessBottom  components */}
            {schedule.nextDay.meals &&
              schedule.nextDay.meals.map((meal, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} className={Styles.MessCardItem}>
                  <MessBottomCard meal={meal} />
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default MessSchedule;
