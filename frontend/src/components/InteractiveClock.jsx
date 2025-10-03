import React, { useState, useEffect, useRef } from 'react';

const timeUtils = {
  parseTime: (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours: hours % 12 || 12, minutes, is24Hour: hours >= 12 };
  },
  
  formatTime: (hours, minutes) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  },
  
  calculateAngle: (value, max) => {
    return (value / max) * 360;
  }
};

const InteractiveClock = ({ targetTime, onTimeSet, isLocked, showTarget }) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const clockRef = useRef(null);

  useEffect(() => {
    if (targetTime && showTarget) {
      const parsed = timeUtils.parseTime(targetTime);
      setHours(parsed.hours);
      setMinutes(parsed.minutes);
    }
  }, [targetTime, showTarget]);

  const handleMouseDown = (hand) => {
    if (isLocked) return;
    if (hand === 'hour') setIsDraggingHour(true);
    if (hand === 'minute') setIsDraggingMinute(true);
  };

  const handleMouseUp = () => {
    setIsDraggingHour(false);
    setIsDraggingMinute(false);
    if (onTimeSet) {
      const timeStr = timeUtils.formatTime(hours, minutes);
      onTimeSet(timeStr);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingHour && !isDraggingMinute) return;
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;

    if (isDraggingMinute) {
      const newMinutes = Math.round(degrees / 6) % 60;
      setMinutes(newMinutes);
    } else if (isDraggingHour) {
      const newHours = Math.round(degrees / 30) % 12 || 12;
      setHours(newHours);
    }
  };

  useEffect(() => {
    if (isDraggingHour || isDraggingMinute) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingHour, isDraggingMinute, hours, minutes]);

  const hourAngle = timeUtils.calculateAngle(hours % 12 + minutes / 60, 12);
  const minuteAngle = timeUtils.calculateAngle(minutes, 60);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={clockRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="drop-shadow-lg"
      >
        <circle cx="150" cy="150" r="140" fill="white" stroke="#333" strokeWidth="4" />
        
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 150 + 120 * Math.cos(angle);
          const y1 = 150 + 120 * Math.sin(angle);
          const x2 = 150 + 130 * Math.cos(angle);
          const y2 = 150 + 130 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="3" />;
        })}
        
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x = 150 + 100 * Math.cos(angle);
          const y = 150 + 100 * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="bold" fill="#333">
              {i === 0 ? 12 : i}
            </text>
          );
        })}
        
        <line
          x1="150" y1="150"
          x2={150 + 70 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={150 - 70 * Math.cos((hourAngle * Math.PI) / 180)}
          stroke={isDraggingHour ? "#667eea" : "#333"}
          strokeWidth="8"
          strokeLinecap="round"
          onMouseDown={() => handleMouseDown('hour')}
          style={{ cursor: isLocked ? 'default' : 'pointer' }}
        />
        
        <line
          x1="150" y1="150"
          x2={150 + 100 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={150 - 100 * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke={isDraggingMinute ? "#667eea" : "#e74c3c"}
          strokeWidth="6"
          strokeLinecap="round"
          onMouseDown={() => handleMouseDown('minute')}
          style={{ cursor: isLocked ? 'default' : 'pointer' }}
        />
        
        <circle cx="150" cy="150" r="10" fill="#333" />
      </svg>
      
      <div className="text-3xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-md">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </div>
    </div>
  );
};

export default InteractiveClock;