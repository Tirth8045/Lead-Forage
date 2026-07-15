const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    stageId: {
      type: String,
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const stageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const pipelineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Sales Pipeline",
    },
    stages: [stageSchema],
    deals: [dealSchema],
  },
  {
    timestamps: true,
  }
);

pipelineSchema.methods.getDealsByStage = function () {
  const stages = {};
  this.stages.forEach((s) => {
    stages[s._id.toString()] = { ...s.toObject(), deals: [] };
  });
  this.deals.forEach((d) => {
    const stageKey = d.stageId.toString();
    if (stages[stageKey]) {
      stages[stageKey].deals.push(d);
    }
  });
  return Object.values(stages).sort((a, b) => a.order - b.order);
};

module.exports = mongoose.model("Pipeline", pipelineSchema);
