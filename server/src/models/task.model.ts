import { model, Schema } from "mongoose";

interface ITask {
  title: string;
  status: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;
