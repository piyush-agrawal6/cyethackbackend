const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { register, login, logout } = require("../controllers/authControllers");

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", logout);

authRoutes.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ isAuthenticated: true });
});

module.exports = authRoutes;
