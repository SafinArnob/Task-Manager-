import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{ type: String, required: true, trim: true },
    description:{ type: String, trim: true },
    completed:{ type: Boolean, default: false },
    priority:{ type: String, enum: ["low", "medium", "high"], default: "medium" },
    category:{ type: String, trim: true, default: "General" },
    tags:[{ type: String, trim: true }],
    deadline:{ type: Date },
    attachments:[{ 
        filename: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
        type: { type: String }
    }],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    estimatedTime: { type: Number }, // in minutes
    actualTime: { type: Number }, // in minutes
    comments: [{
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
    }],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
  },

  { timestamps: true }
);


taskSchema.index({ owner: 1, completed: 1 });
taskSchema.index({ owner: 1, deadline: 1 });
taskSchema.index({ owner: 1, priority: 1 });
taskSchema.index({ owner: 1, category: 1 });

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
