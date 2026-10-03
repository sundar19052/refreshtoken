const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");


dotenv.config();

const app = express();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

// MongoDB
connectDB();


// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


// Auth routes
app.use("/api/auth", authRoutes);

// Protected Route

app.get(
    "/api/profile",
    authMiddleware,
    async (req, res) => {
 
	res.json({

            message: "You accessed protected data",

            user: req.user

        });

    }
);


app.listen(process.env.PORT, () => {

    console.log(
        `Server running on http://localhost:${process.env.PORT}`
    );

});