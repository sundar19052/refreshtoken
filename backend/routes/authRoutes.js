const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// Generate Access Token

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "1m"
        }
    );
};

// Generate Refresh Token

const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "3m"
        }
    );
};




// REGISTER

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check user
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({

            name,
            email,
            password: hashedPassword

        });


        res.status(201).json({

            message: "Registration successful"

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// LOGIN

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Access Token Cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1 * 60 * 1000
        });

        // Refresh Token Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



// REFRESH TOKEN
router.post("/refresh-token", async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        // No refresh token
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Generate NEW access token
        const newAccessToken = generateAccessToken(user);

        // Store new access token in cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1 * 60 * 1000
        });

        res.json({
            message: "Access token refreshed"
        });

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }

});

// LOGOUT

router.post("/logout", (req, res) => {

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    res.json({

        message: "Logout successful"

    });

});


module.exports = router;