import pool from "../db/index.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let query = "update users SET name = ?, email = ?";
    const params = [name, email];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password_hash = ?";
      params.push(hashedPassword);
    }
    query += " WHERE id = ?";
    params.push(req.user.id);
    await pool.query(query, params);
    res.json({ message: "Profile updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};
