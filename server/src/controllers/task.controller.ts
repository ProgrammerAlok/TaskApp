import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import User from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    const task = await Task.create({ title });

    if (!task) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Error in create task please try later...")
        );
    }

    const { userId } = req.body.user;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found..."));
    }

    user.addTask(String(task._id));
    await user.save();
    await task.save();

    res.status(201).json(new ApiResponse(201, task, "Task created success..."));
  }
);

export const getAllTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body.user;

    const user = await User.findById(userId).populate("tasks");

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Tasks not found..."));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user.tasks, "Tasks fetch success..."));
  }
);

export const editTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Task not found..."));
    }

    const { userId } = req.body.user;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found..."));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: req.body.title || task.title,
        status: req.body.status || task.status,
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task updated success..."));
  }
);

export const deleteTaskById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Task not found..."));
    }

    const { userId } = req.body.user;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found..."));
    }

    user.deleteTask(taskId);

    await user.save();
    await Task.findByIdAndDelete(taskId);

    res.status(202).json(new ApiResponse(202, user, "Task delete success..."));
  }
);
