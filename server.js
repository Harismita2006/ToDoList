const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TodoModel = require("./models/todoList");
const UserModel = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/todo")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Signup endpoint
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new UserModel({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create and assign token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Protected routes 
app.get("/getTodoList", authenticateToken, (req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => res.status(500).json(err));
});

app.post("/addTodoList", authenticateToken, (req, res) => {
    TodoModel.create({
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline,
    })
        .then((todo) => res.json(todo))
        .catch((err) => res.status(500).json(err));
});

app.put("/updateTodoList/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const updateData = {
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline,
    };
    TodoModel.findByIdAndUpdate(id, updateData, { new: true })
        .then((todo) => res.json(todo))
        .catch((err) => res.status(500).json(err));
});

app.delete("/deleteTodoList/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete(id)
        .then((todo) => res.json(todo))
        .catch((err) => res.status(500).json(err));
});

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the Todo API");
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
