import React, { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const Countdown = ({ targetDate }) => {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, over: false });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(targetDate);
      const ms = end - now;
      if (isNaN(end.getTime()) || ms <= 0) {
        setRemaining((prev) => ({ ...prev, over: true }));
        return;
      }
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const seconds = Math.floor((ms / 1000) % 60);
      setRemaining({ days, hours, minutes, seconds, over: false });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (remaining.over) return <span>Time over</span>;

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span>{pad(remaining.days)}d</span>
      <span>{pad(remaining.hours)}h</span>
      <span>{pad(remaining.minutes)}m</span>
      <span>{pad(remaining.seconds)}s</span>
    </div>
  );
};

export default Countdown;


