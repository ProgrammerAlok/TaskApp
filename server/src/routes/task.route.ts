import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
  createTask,
  deleteTaskById,
  editTask,
  getAllTask,
} from "../controllers/task.controller";

const router = Router();

router.use(isLoggedIn);

router.route("/task").put(editTask);

router.route("/tasks").get(getAllTask).post(createTask);

router.route("/tasks/:id").delete(deleteTaskById);

export default router;
