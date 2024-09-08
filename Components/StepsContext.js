import React, { createContext, useState } from 'react';

export const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);

  return (
    <StepsContext.Provider value={{ weeklySteps, totalSteps, setWeeklySteps, setTotalSteps }}>
      {children}
    </StepsContext.Provider>
  );
};
