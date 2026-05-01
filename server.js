const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Connection Error:', err));


// ✅ Schema (Validation)
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  age: {
    type: Number,
    min: [1, "Age must be positive"]
  },
  course: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true   // prevents duplicates
  }
});

const Student = mongoose.model('Student', studentSchema);


// ================= CRUD =================

// 🟢 CREATE
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedData = await student.save();

    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// 🔵 READ ALL
app.get('/students', async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔵 READ ONE
app.get('/students/:id', async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});


// 🟡 UPDATE
app.put('/students/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// 🔴 DELETE
app.delete('/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});


// 🚀 Start Server
app.listen(3000, () => {
 console.log('Server running at http://localhost:3000');
});