import express from "express";
import Message from "../models/messageModel.mjs";
import Group from "../models/groupModel.mjs";
import { protect, isGroupMember } from "../middleware/authMiddleware.mjs";

const router = express.Router();

/* ============================= */
/*       Group Messages          */
/* ============================= */
router.post("/group", protect, isGroupMember, async (req, res) => {
  try {
    const { groupId, content } = req.body;
    const message = new Message({ sender: req.user._id, group: groupId, content });
    await message.save();

    // Populate sender for frontend
    const populatedMsg = await message.populate("sender", "username _id");
    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/group/:groupId", protect, isGroupMember, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "username _id")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ============================= */
/*        Direct Messages        */
/* ============================= */

// Send DM
router.post("/dm/:receiverId", protect, async (req, res) => {
  const { content } = req.body;
  try {
    // 1️⃣ create & save
    const message = await Message.create({
      sender: req.user._id,
      receiver: req.params.receiverId,
      content,
    });

    // 2️⃣ populate sender & receiver
    const populatedMsg = await Message.findById(message._id)
      .populate("sender", "username _id")
      .populate("receiver", "username _id");

    res.status(201).json(populatedMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get DMs between logged-in user and selected user
router.get("/dm/:userId", protect, async (req, res) => {
  const myId = req.user._id;
  const otherId = req.params.userId;
  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })
      .populate("sender", "username _id")
      .populate("receiver", "username _id")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
