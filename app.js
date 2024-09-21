const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const listRoutes = require("./routes/listRoutes");
const cors = require("cors");
const helmet = require("helmet"); // For security headers
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security best practices

// CORS configuration
const allowedOrigins = [
  "https://cyethackk.vercel.app",
  "http://localhost:5173",
  "https://cyethackassignment.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/list", listRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
