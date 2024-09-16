import React from 'react';
import { StepsProvider } from './Components/StepsContext';
import MyActivity from './Components/MyActivity'; // Ensure the correct path to MyActivity

const App = () => {
  return (
    <StepsProvider>
      <MyActivity />
    </StepsProvider>
  );
};

export default App;
