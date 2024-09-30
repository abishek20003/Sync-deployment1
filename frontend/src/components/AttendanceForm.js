import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosConfig';

const AttendanceForm = ({ addRecord }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [department, setDepartment] = useState('');
    const [inTime, setInTime] = useState('');
    const [outTime, setOutTime] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');

    // Set today's date as default
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        setAttendanceDate(today);
    }, []);

    // Convert 24-hour format to 12-hour format with AM/PM
    const formatTime12Hour = (time) => {
        let [hour, minute] = time.split(':').map(Number);
        const isPM = hour >= 12;
        hour = hour % 12 || 12; // Convert hour to 12-hour format, with 12 instead of 0
        const period = isPM ? 'PM' : 'AM';
        return `${hour}:${minute < 10 ? '0' + minute : minute} ${period}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const workHours = calculateWorkHours(inTime, outTime);
        const data = {
            employeeName,
            employeeID,
            department,
            attendanceDate,
            inTime: formatTime12Hour(inTime),
            outTime: formatTime12Hour(outTime),
            workHours,
        };

        try {
            const response = await axiosInstance.post('/add-attendance', data);
            if (response.status === 201) {
                alert('Attendance added successfully');
                clearForm();
                addRecord(data); // Update parent state with new record
                window.location.reload(); // Reload the page to view the updated data
            } else {
                alert('Failed to add attendance');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('Error adding attendance');
        }
    };

    // Manually calculate work hours difference in HH.MM format
    const calculateWorkHours = (inTime, outTime) => {
        const [inHour, inMinute] = inTime.split(':').map(Number);
        const [outHour, outMinute] = outTime.split(':').map(Number);

        // Convert time into minutes from the start of the day
        const inTotalMinutes = inHour * 60 + inMinute;
        const outTotalMinutes = outHour * 60 + outMinute;

        // Calculate the difference in minutes, handling overnight shifts
        let diffInMinutes = outTotalMinutes - inTotalMinutes;
        if (diffInMinutes < 0) {
            diffInMinutes += 24 * 60; // Add 24 hours of minutes if time crosses midnight
        }

        // Convert the minutes into hours and minutes (HH.MM format)
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = Math.round(diffInMinutes % 60);

        // Format the result to two decimal places (e.g., 1.35)
        const formattedWorkHours = hours + (minutes / 60).toFixed(2).slice(1); // .slice(1) to keep .MM format
        return formattedWorkHours;
    };

    const clearForm = () => {
        setEmployeeName('');
        setEmployeeID('');
        setDepartment('');
        setInTime('');
        setOutTime('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td><label>Employee Name:</label></td>
                        <td><input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td><label>Employee ID:</label></td>
                        <td><input type="text" value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td><label>Department:</label></td>
                        <td><input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td><label>Attendance Date:</label></td>
                        <td><input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td><label>In Time:</label></td>
                        <td><input type="time" value={inTime} onChange={(e) => setInTime(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td><label>Out Time:</label></td>
                        <td><input type="time" value={outTime} onChange={(e) => setOutTime(e.target.value)} required /></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><button type="submit">Add Record</button></td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default AttendanceForm;
