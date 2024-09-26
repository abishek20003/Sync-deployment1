import React, { useState, useEffect } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceTable from './components/AttendanceTable';
import axiosInstance from './components/axiosConfig';
import './App.css';

const App = () => {
    const [records, setRecords] = useState([]);

    // Fetch attendance records from the backend when the component mounts
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axiosInstance.get('/attendance');
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching attendance records:', error.response ? error.response.data : error.message);
            }
        };

        fetchRecords();
    }, []);

    const addRecord = (newRecord) => {
        setRecords([...records, newRecord]);
    };

    return (
        <div className="container">
            <div className="form-container">
                <AttendanceForm addRecord={addRecord} />
            </div>
            <div className="table-container">
                <AttendanceTable records={records} />
            </div>
        </div>
    );
};

export default App;
