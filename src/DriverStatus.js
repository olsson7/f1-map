const DRIVERS = [
    { id: 'de_vries', name: 'Nyck de Vries' },
    { id: 'lawson', name: 'Liam Lawson' }
];

// In-memory storage for driver statuses
let statuses = {
    'de_vries': 'Fired',    // Default status for Nyck de Vries
    'lawson': 'Reserve'  // Default status for Logan Lawson
};

// Fetch driver status 
export const getDriverStatus = (driverId) => {
    return statuses[driverId];
};