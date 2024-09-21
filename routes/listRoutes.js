const express = require("express");
const router = express.Router();
const List = require("../models/listModel");
const { verifyToken } = require("../middlewares/authMiddleware");

// Create a new list item
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, age, description, address, tags } = req.body;
    const userId = req.user.id; // Get userId from the middleware

    const list = new List({ name, age, description, address, tags, userId });
    await list.save();
    res.status(201).send(list);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Fetch all list items for the authenticated user
router.get("/get", verifyToken, async (req, res) => {
  try {
    const lists = await List.find(); // Fetch lists associated with the user
    res.status(200).send(lists);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch a single list item by ID
router.get("/get/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id });
    if (!list) {
      return res
        .status(404)
        .send("List item not found or you do not have permission");
    }
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a list item by ID
router.patch("/edit/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!list) {
      return res
        .status(404)
        .send("List item not found or you do not have permission");
    }
    res.status(200).send(list);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a list item by ID
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({
      _id: req.params.id,
    });
    if (!list) {
      return res
        .status(404)
        .send("List item not found or you do not have permission");
    }
    res.status(200).send("List item deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
