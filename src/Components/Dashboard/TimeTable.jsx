import React, { useState, useEffect } from 'react';
import './CSS/Timetable.css';
import { AppStates } from '../../Context/appContext.jsx';
import { getTimeTableData } from '../../Helpers';

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
];

// time specifies the duration of the class
// left specifies the position of the card
// rollno specifies the roll number of the student

function GetDay() {
  const day = new Date().getDay();
  const daylist = ['Sunday', 'Monday', 'Tuesday', 'Wednesday ', 'Thursday', 'Friday', 'Saturday'];
  return daylist[day];
}

function DashboardScroll({ Left }) {
  const [_currentTime, _setCurrentTime] = useState(new Date());
  const [TimeTableArray, setTimeTableArray] = useState(null);
  const today = GetDay();
  const { user } = AppStates();

  useEffect(() => {
    async function setTimeTableData() {
      const timeTableData = await getTimeTableData(user?.email);

      timeTableData.forEach((object) => {
        if (object.day.trim().toLowerCase() === today.trim().toLowerCase()) {
          setTimeTableArray(object.Data);
        }
      });
    }
    if (user) setTimeTableData();
  }, [user, today]);

  useEffect(() => {
    const timer = setInterval(() => {
      _setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* the entire grid moves left so as to always keep the pointer aligned to real time */}
      <div className="ScrollTimeTable" style={{ left: -Left * 20 + 50 + '%' }}>
        <div className="timeScroll">
          {timeSlots.map((time, index) => (
            <div className="text-slate-500 whitespace-nowrap" key={index}>
              <div className="bg-slate-300 px-2 py-1 rounded w-min translate-x-[-50%]">{time}</div>
            </div>
          ))}
        </div>
        <div className="cardScroll">
          {TimeTableArray?.map((timeTable) => (
            // the width and position is set using the values from the json file
            <div
              className="classCard"
              key={timeTable.id}
              style={{
                width: `${timeTable.duration * 19.67}%`,
                left: `${timeTable.left * 20}%`,
                top: '1rem',
                transform: `translateY(${(timeTable.id % 2) * 102}%)`,
                fontSize: '1.2rem',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.3rem', color: '#005C6A', fontWeight: 'bold' }}>
                {timeTable.subject}
              </div>
              <div>{timeTable.Prof}</div>
              <div style={{ display: 'flex', gap: '1.3rem', fontSize: '0.9rem' }}>
                <div
                  className="Type"
                  style={{
                    padding: '3px',
                    backgroundColor: timeTable.type === 'Theory' ? '#FFCE31' : '#FF3131',
                    color: 'white',
                  }}
                >
                  {timeTable.type}
                </div>
                <div
                  style={{
                    padding: '3px',
                    borderRadius: '4px',
                    color: '#005C6A',
                    border: '1px solid #005C6A',
                  }}
                >
                  {timeTable.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardScroll;
