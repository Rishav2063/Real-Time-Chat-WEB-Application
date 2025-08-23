import jwt from "jsonwebtoken";
import User from "../models/userModel.mjs";
import Group from "../models/groupModel.mjs";

export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const isGroupMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check user is in members array
    if (group.members.includes(req.user._id)) {
      next();
    } else {
      return res.status(403).json({ message: "You are not a member of this group" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};