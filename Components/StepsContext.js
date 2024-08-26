// StepsContext.js
import React, { createContext, useState } from 'react';

export const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
  const [todaySteps, setTodaySteps] = useState(0);
  const [weekSteps, setWeekSteps] = useState([0, 0, 0, 0, 0, 0, 0]); // Initialize with 7 days

  return (
    <StepsContext.Provider value={{ todaySteps, setTodaySteps, weekSteps, setWeekSteps }}>
      {children}
    </StepsContext.Provider>
  );
};
