require('dotenv').config(); // Ensure dotenv is loaded for the .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const attendanceSchema = new mongoose.Schema({
    employeeName: String,
    employeeID: String,
    department: String,
    attendanceDate: String, // Keep as String for date filtering (format YYYY-MM-DD)
    inTime: String,
    outTime: String,
    workHours: String,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Root route to handle GET requests to the homepage
app.get('/', (req, res) => {
    res.send('Welcome to the Attendance Management API');
});

// Add attendance record
app.post('/add-attendance', async (req, res) => {
    const { employeeName, employeeID, department, inTime, outTime, workHours } = req.body;
    const attendanceDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    try {
        const attendance = new Attendance({ employeeName, employeeID, department, attendanceDate, inTime, outTime, workHours });
        await attendance.save();
        res.status(201).send('Attendance record added successfully');
    } catch (err) {
        res.status(500).send('Error saving attendance record');
    }
});

// Fetch attendance records with optional date filter
app.get('/attendance', async (req, res) => {
    // Get the date from the query parameters (YYYY-MM-DD format)
    const { date } = req.query;

    let filterDate = date || new Date().toISOString().split('T')[0]; // Default to today if no date is provided

    try {
        // Fetch attendance records for the given date
        const attendanceRecords = await Attendance.find({ attendanceDate: filterDate });
        res.json(attendanceRecords);
    } catch (err) {
        res.status(500).send('Error retrieving attendance records');
    }
});

// Delete attendance record by ID
app.delete('/attendance/:id', async (req, res) => {
    try {
        const attendanceId = req.params.id;
        const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);
        if (deletedAttendance) {
            res.status(200).send('Attendance record deleted successfully');
        } else {
            res.status(404).send('Attendance record not found');
        }
    } catch (err) {
        res.status(500).send('Error deleting attendance record');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
