import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig'; // Import axiosConfig
import './AttendanceTable.css'; // Import CSS

const AttendanceTable = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); // State to store the selected date

    // Function to fetch attendance records for a given date (or today's date by default)
    const fetchAttendanceRecords = async (date = '') => {
        try {
            const response = await axiosInstance.get('/attendance', {
                params: { date }, // Send the selected date as a query parameter
            });
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance records', error);
        }
    };

    // Fetch today's attendance on component load
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        setSelectedDate(today); // Set today's date as default
        fetchAttendanceRecords(today); // Fetch attendance for today
    }, []);

    // Handle the form submission when the user clicks "Submit"
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form from submitting the traditional way
        fetchAttendanceRecords(selectedDate); // Fetch attendance for the selected date
    };

    return (
        <div className="attendance-table-container">
            <h2>Attendance Records</h2>

            {/* Date Picker Form */}
            <form onSubmit={handleSubmit}>
                <div className="date-picker">
                    <label htmlFor="attendanceDate">Select Date: </label>
                    <input
                        type="date"
                        id="attendanceDate"
                        value={selectedDate} // Bind input to selectedDate state
                        onChange={(e) => setSelectedDate(e.target.value)} // Update state on date change
                    />
                    <button type="submit">Submit</button> {/* Submit button */}
                </div>
            </form>

            <div className="records-container">
                {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                        <div className="record-card" key={record._id}>
                            <h3>{record.employeeName}</h3>
                            <p><strong>ID:</strong> {record.employeeID}</p>
                            <p><strong>Department:</strong> {record.department}</p>
                            <p><strong>Date:</strong> {new Date(record.attendanceDate).toLocaleDateString()}</p>
                            <p><strong>In Time:</strong> {record.inTime}</p>
                            <p><strong>Out Time:</strong> {record.outTime}</p>
                            <p><strong>Work Hours:</strong> {record.workHours}</p>
                        </div>
                    ))
                ) : (
                    <p>No attendance records found for {selectedDate}</p> // Display message if no records found
                )}
            </div>
        </div>
    );
};

export default AttendanceTable;
