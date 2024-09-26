import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig'; // Import axiosConfig

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
        <div>
            <h2>Today's Attendance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Department</th>
                        <th>Attendance Date</th>
                        <th>In Time</th>
                        <th>Out Time</th>
                        <th>Work Hours</th>
                        <th>Action</th> {/* Add Action column for the delete button */}
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record) => (
                        <tr key={record._id}>
                            <td>{record.employeeName}</td>
                            <td>{record.employeeID}</td>
                            <td>{record.department}</td>
                            <td>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                            <td>{record.inTime}</td>
                            <td>{record.outTime}</td>
                            <td>{record.workHours}</td>
                            <td>
                                {/* Delete button */}
                                <button onClick={() => deleteAttendanceRecord(record._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
