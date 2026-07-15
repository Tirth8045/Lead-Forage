const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
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
    position: {
      type: String,
      trim: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    convertedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

contactSchema.set("toJSON", { virtuals: true });
contactSchema.set("toObject", { virtuals: true });

contactSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("Contact", contactSchema);
