const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

const register = asyncHandler(async (req, res) => {    
    //
    const { username, email, password } = req.body;
    if (!username || !email || !password ) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201);
        res.json({_id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

const login = asyncHandler(async (req, res) => {    
    const { email, password } = req.body;
    if (!email || !password ) {
        res.status(400);
        throw new Error("Both email and password are mandatory");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60m" }
        );
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        throw new Error("Email or password is incorrect");
    }
});

const current = asyncHandler(async (req, res) => {    
    res.status(200).json(req.user);
});

module.exports = {
    register,
    login,
    current
}
