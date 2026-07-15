const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
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

noteSchema.index({ relatedId: true, onModel: true });

module.exports = mongoose.model("Note", noteSchema);
