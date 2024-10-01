import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import AttendanceTable from './components/AttendanceTable';
import axiosInstance from './components/axiosConfig';
import './App.css';

const App = () => {
    const [records, setRecords] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // For password authentication for the table
    const [password, setPassword] = useState('');
    const correctPassword = 'Sync135'; // Set your desired password here

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

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            setIsAuthenticated(true); // Allow access if the password is correct
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <Router>
            <div className="container">
                <nav>
                    <Link to="/form">Attendance Form</Link> |{' '}
                    <Link to="/table">View Attendance Records</Link>
                </nav>

                <Routes>
                    <Route path="/form" element={<AttendanceForm addRecord={addRecord} />} />
                    <Route
                        path="/table"
                        element={
                            isAuthenticated ? (
                                <AttendanceTable records={records} />
                            ) : (
                                <form onSubmit={handlePasswordSubmit}>
                                    <div>
                                        <label htmlFor="password">Enter Password: </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button type="submit">Submit</button>
                                    </div>
                                </form>
                            )
                        }
                    />
                    <Route path="/" element={<AttendanceForm addRecord={addRecord} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
