import express from "express";
import pool from "../db/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select id, name, email, role, created_at from users"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "insert into  users (name, email, password_hash, role) values (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: "Employee created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

export const editEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;
  try {
    let query = "update users SET name = ?, email = ?, role = ?";
    const params = [name, email, role];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password_hash = ?";
      params.push(hashedPassword);
    }
    query += " WHERE id = ?";
    params.push(id);
    await pool.query(query, params);
    res.json({ message: "Employee updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("delete FROM users where id = ?", [id]);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default router;
