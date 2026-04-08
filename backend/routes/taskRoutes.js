const express = require("express");

const taskController = require("../controllers/taskController");
const {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
} = require("../middlewares/validateTask");

const router = express.Router();

router.patch("/:id", validateTaskId, taskController.toggleTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", validateTaskId, taskController.getTaskById);
router.post("/", validateCreateTask, taskController.createTask);
router.put(
  "/:id",
  validateTaskId,
  taskController.updateTask
);

router.delete("/:id", validateTaskId, taskController.deleteTask);

module.exports = router;
