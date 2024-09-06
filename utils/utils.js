// utils.js
export const getWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const days = [];
  
    for (let i = 1; i <= 7; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() - currentDay + i);
      days.push(day);
    }
  
    return days;
  };
  