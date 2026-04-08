const { pool } = require("../config/db");

exports.getAllTasks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)",
      [title, description]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      completed: 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task updated",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.toggleTask = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT completed FROM tasks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newStatus = rows[0].completed === 1 ? 0 : 1;

    await pool.query(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      [newStatus, id]
    );

    res.json({
      success: true,
      message: "Task toggled",
      completed: newStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};