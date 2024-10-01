import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig'; // Import axiosConfig
import './AttendanceTable.css'; // Make sure to create this CSS file

const AttendanceTable = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // Fetch attendance records
    const fetchAttendanceRecords = async () => {
        try {
            const response = await axiosInstance.get('/attendance');
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance records', error);
        }
    };

    useEffect(() => {
        // Fetch attendance records on component load
        fetchAttendanceRecords();

        // Set interval to auto-refresh every 24 hours (86400000 ms)
        const interval = setInterval(() => {
            fetchAttendanceRecords();
        }, 86400000); // Refresh every 24 hours

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run only on initial render

    // Delete attendance record
    const deleteAttendanceRecord = async (id) => {
        try {
            await axiosInstance.delete(`/attendance/${id}`);
            // Refetch the records after deletion to ensure state is in sync
            fetchAttendanceRecords();
        } catch (error) {
            console.error('Error deleting attendance record', error);
        }
    };

    return (
        <div className="attendance-table-container">
            <h2>Today's Attendance</h2>
            <div className="records-container">
                {attendanceRecords.map((record) => (
                    <div className="record-card" key={record._id}>
                        <h3>{record.employeeName}</h3>
                        <p><strong>ID:</strong> {record.employeeID}</p>
                        <p><strong>Department:</strong> {record.department}</p>
                        <p><strong>Date:</strong> {new Date(record.attendanceDate).toLocaleDateString()}</p>
                        <p><strong>In Time:</strong> {record.inTime}</p>
                        <p><strong>Out Time:</strong> {record.outTime}</p>
                        <p><strong>Work Hours:</strong> {record.workHours}</p>
                        <button onClick={() => deleteAttendanceRecord(record._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceTable;
