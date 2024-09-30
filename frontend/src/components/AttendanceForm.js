import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosConfig';

const AttendanceForm = ({ addRecord }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [department, setDepartment] = useState('');
    const [inTime, setInTime] = useState('');
    const [outTime, setOutTime] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');

    // Set today's date and current time as default
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        setAttendanceDate(today);

        // Get the current time in 12-hour format
        const currentTime = new Date();
        const formattedTime = formatTime12Hour(currentTime);
        setInTime(formattedTime);
        setOutTime(formattedTime);
    }, []);

    // Convert Date object to 12-hour format HH:MM AM/PM
    const formatTime12Hour = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format, converting 0 to 12
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
        return `${hours}:${formattedMinutes} ${period}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const workHours = calculateWorkHours(inTime, outTime);
        const data = {
            employeeName,
            employeeID,
            department,
            attendanceDate,
            inTime: formatTime12HourTo24(inTime), // Convert back to 24-hour format for the backend
            outTime: formatTime12HourTo24(outTime),
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

    // Function to convert 12-hour format to 24-hour format
    const formatTime12HourTo24 = (time) => {
        let [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = parseInt(hours, 10);
        if (period === 'PM' && hours < 12) {
            hours += 12; // Convert PM to 24-hour format
        }
        if (period === 'AM' && hours === 12) {
            hours = 0; // Midnight case
        }
        return `${hours.toString().padStart(2, '0')}:${minutes}`; // Format as HH:MM
    };

    const calculateWorkHours = (inTime, outTime) => {
        const inTimeDate = new Date(`1970-01-01T${formatTime12HourTo24(inTime)}:00`);
        const outTimeDate = new Date(`1970-01-01T${formatTime12HourTo24(outTime)}:00`);
        let diff = (outTimeDate - inTimeDate) / (1000 * 60); // Get the difference in minutes

        // Convert the minutes into hours and minutes (HH.MM format)
        const hours = Math.floor(diff / 60);
        const minutes = Math.floor(diff % 60);

        // Format the result to two decimal places
        const formattedWorkHours = hours + '.' + (minutes < 10 ? `0${minutes}` : minutes);
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
