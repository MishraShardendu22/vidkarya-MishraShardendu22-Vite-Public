import React, { useState, useEffect, useCallback } from 'react';
import './CSS/Timetable.css';
import AlertCard from './AlertCard';
import TimeTable from './TimeTable';
import { axios, ANNOUNCEMENT } from '../../api';
import { sendReqToServer } from '../../Hooks/useAxios';
import { useToasts } from '../UI/toast';

function ClassSchedule() {
  const [time, setTime] = useState(new Date());
  const [pointerLeft, setPointerLeft] = useState(0);
  const [alerts, setAlerts] = useState();
  const [notify] = useToasts();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    calculatePointerPosition();
  }, [time, calculatePointerPosition]);

  // Fetch Alerts
  useEffect(() => {
    async function getAlerts() {
      try {
        const { response, error: _error } = await sendReqToServer({
          axiosInstance: axios,
          url: ANNOUNCEMENT.get,
          method: 'GET',
          requestConfig: {},
        });
        if (response) {
          setAlerts(response.body?.announcements);
        }
      } catch (err) {
        console.error(err);
        notify({
          type: 'ERROR',
          message: 'Alerts could not be fetched',
        });
      }
    }

    getAlerts();
  }, [notify]);

  const calculatePointerPosition = useCallback(() => {
    let position;
    const currentTime = time.getHours() * 60 + time.getMinutes();
    // const currentTime = 840

    // Realtime-Scrolling from 9AM(09:00 * 60) to 9PM(21:00 * 60) only
    if (currentTime >= 540 && currentTime <= 1260) {
      position = (currentTime - 540) / 60;
    } else {
      position = -0.5;
    }
    setPointerLeft(position);
  }, [time, setPointerLeft]);

  return (
    <div className="classScheduleWrapper">
      <div className="eventsRightTop">
        <div className="eventsTopHeading">Lecture Schedule</div>
        {/* <div className="eventsRightTopSearchBox">
          <input
            type="text"
            placeholder="Search for events"
            className="eventsRightTopSearchBar"
          />
        </div> */}
      </div>

      <div className="class-section">
        <div className="timetable-section">
          <TimeTable Left={pointerLeft} />
          <div className="timer-pointer">
            <div className="timer-pointer-heading">
              <div className="p-1 bg-slate-400/20 backdrop-blur-sm rounded">
                {time.toLocaleTimeString()}
              </div>
              <div className="timer-pointer-heading-icon" />
            </div>
            <div className="timer-pointer-body" />
          </div>
        </div>

        <div className="RecentAlerts-Heading">Recent Alerts</div>
        <div className="RecentAlerts">
          {alerts ? (
            alerts.map((alertData, idx) => {
              return <AlertCard key={idx} alert={alertData} />;
            })
          ) : (
            <div>No Alerts</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassSchedule;
