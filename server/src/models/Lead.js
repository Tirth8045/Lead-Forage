const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["website", "referral", "cold_call", "social_media", "walk_in", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "unqualified", "converted"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
    convertedAt: {
      type: Date,
    },
    convertedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1, assignedTo: 1 });
leadSchema.index({ email: 1 });

module.exports = mongoose.model("Lead", leadSchema);
