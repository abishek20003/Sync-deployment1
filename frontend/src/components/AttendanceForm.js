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

        // Get the current time in HH:MM format (24-hour format for input)
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        setInTime(currentTime);
        setOutTime(currentTime);
    }, []);

    // Convert 24-hour format to 12-hour format with AM/PM for display
    const formatTime12Hour = (time) => {
        let [hour, minute] = time.split(':');
        hour = parseInt(hour, 10);

        const period = hour >= 12 ? 'PM' : 'AM';

        if (hour === 0) {
            hour = 12; // Midnight case
        } else if (hour > 12) {
            hour -= 12; // Convert times greater than 12 to 12-hour format
        }

        return `${hour}:${minute} ${period}`;
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

    const calculateWorkHours = (inTime, outTime) => {
        const inTimeDate = new Date(`1970-01-01T${inTime}:00`);
        const outTimeDate = new Date(`1970-01-01T${outTime}:00`);
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
                        <td>
                            <input 
                                type="time" 
                                value={inTime} 
                                onChange={(e) => setInTime(e.target.value)} 
                                required 
                            />
                            <span className="time-display">{formatTime12Hour(inTime)}</span> {/* Display 12-hour format */}
                        </td>
                    </tr>
                    <tr>
                        <td><label>Out Time:</label></td>
                        <td>
                            <input 
                                type="time" 
                                value={outTime} 
                                onChange={(e) => setOutTime(e.target.value)} 
                                required 
                            />
                            <span className="time-display">{formatTime12Hour(outTime)}</span> {/* Display 12-hour format */}
                        </td>
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
