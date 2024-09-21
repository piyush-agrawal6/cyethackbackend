const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";

// Function to create a JWT token for the user
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Handler for user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "User with this email already registered" });
    }

    // Create a new user
    const user = await User.create({ name, email, password });
    const token = createToken(user);

    // Set a cookie with the JWT token
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Use HTTPS only in production
      sameSite: isProduction ? "None" : "Lax", // None for cross-origin requests
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Handler for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find a user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the provided password matches the stored password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token for the authenticated user
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Use HTTPS only in production
      sameSite: isProduction ? "None" : "Lax", // None for cross-origin requests
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

// Handler for user logout
exports.logout = (req, res) => {
  // Clear the token cookie by setting its expiration date to a past date
  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction, // Ensure secure cookie handling
    sameSite: isProduction ? "None" : "Lax",
    expires: new Date(0), // Expire immediately
  });
  res.status(200).json({ message: "Logout successful" });
};
