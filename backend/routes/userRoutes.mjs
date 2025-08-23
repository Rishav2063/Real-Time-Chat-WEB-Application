import express from "express";
import User from "../models/userModel.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check already user
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // send response without password
    res.status(201).json({
      message: "User created",
      token,
      name: user.name,
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// GET /api/auth/all-users
router.get("/all-users", async (req, res) => {
  const users = await User.find({}, { name: 1 }); // only get names
  res.json(users);
});

router.get("/search", async (req, res) => {
  const { q } = req.query; // query string: ?q=name
  try {
    const users = await User.find({
      name: { $regex: q, $options: "i" } // case-insensitive match
    }).select("name email"); // select only needed fields

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ Login Route
// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send userId also
    res.json({ 
      token, 
      name: user.name, 
      email: user.email,
      userId: user._id // ✅ added userId
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
