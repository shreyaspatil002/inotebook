const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
// const { findById } = require('../models/Notes');

const JWT_SECRET = 'letthis#@isthejwt$secret';

const router = express.Router();

// Create a user (no login required)
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "An account with this email already exists. Please choose another one." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const payload = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        success=true
        res.json({success, authtoken }); // Sending JWT token back to the client
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Authenticate user (no login required)
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is required').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            success = false
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        success = true

        res.json({ success, authtoken }); // Sending JWT token back to the client
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// get logged in user details using POST /api/auth/getuser   log in requried 
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
