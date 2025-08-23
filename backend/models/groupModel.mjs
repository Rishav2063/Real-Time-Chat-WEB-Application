// models/groupModel.mjs
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // group members
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;

