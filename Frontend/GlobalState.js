
import { createGlobalState } from 'react-hooks-global-state';

const initialState = { 
    startDate: null,
    endDate: null,
    dailyStepRecord:[
        { "date": "2024-08-01T00:00:00.000Z", "steps": 120 },
        { "date": "2024-08-02T00:00:00.000Z", "steps": 85 },
        { "date": "2024-08-03T00:00:00.000Z", "steps": 200 },
        { "date": "2024-08-04T00:00:00.000Z", "steps": 90 },
        { "date": "2024-08-05T00:00:00.000Z", "steps": 150 },
        { "date": "2024-08-06T00:00:00.000Z", "steps": 130 },
        { "date": "2024-08-07T00:00:00.000Z", "steps": 170 },
        { "date": "2024-08-08T00:00:00.000Z", "steps": 110 },
        { "date": "2024-08-09T00:00:00.000Z", "steps": 95 },
        { "date": "2024-08-10T00:00:00.000Z", "steps": 160 },
        { "date": "2024-08-11T00:00:00.000Z", "steps": 140 },
        { "date": "2024-08-12T00:00:00.000Z", "steps": 180 },
        { "date": "2024-08-13T00:00:00.000Z", "steps": 125 },
        { "date": "2024-08-14T00:00:00.000Z", "steps": 155 },
        { "date": "2024-08-15T00:00:00.000Z", "steps": 135 },
        { "date": "2024-08-16T00:00:00.000Z", "steps": 145 },
        { "date": "2024-08-17T00:00:00.000Z", "steps": 170 }
    ]
    
};

const { setGlobalState, useGlobalState } = createGlobalState(initialState);

export { useGlobalState, setGlobalState };