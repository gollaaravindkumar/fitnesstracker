import React, { createContext, useState } from 'react';

// Create the context
const StepsContext = createContext();

// Create a provider component
const StepsProvider = ({ children }) => {
  const [todaySteps, setTodaySteps] = useState(0);
  const [weekSteps, setWeekSteps] = useState(0);
  const [monthSteps, setMonthSteps] = useState(0);

  return (
    <StepsContext.Provider value={{ todaySteps, setTodaySteps, weekSteps, setWeekSteps, monthSteps, setMonthSteps }}>
      {children}
    </StepsContext.Provider>
  );
};

export { StepsProvider, StepsContext };
