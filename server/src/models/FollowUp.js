const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["call", "email", "meeting", "task"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    onModel: {
      type: String,
      enum: ["Lead", "Contact", "Deal"],
    },
  },
  {
    timestamps: true,
  }
);

followUpSchema.index({ assignedTo: 1, dueDate: 1 });
followUpSchema.index({ completed: 1 });

module.exports = mongoose.model("FollowUp", followUpSchema);
