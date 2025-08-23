import express from "express";
import Group from "../models/groupModel.mjs";   // jo model banaya hai usko import karo
import User from "../models/userModel.mjs";

const router = express.Router();

// ✅ Create Group
router.post("/", async (req, res) => {
  try {
    const { name, members } = req.body; // members = [userId1, userId2]
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().populate("members", "username email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get single group
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("members", "username email");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
