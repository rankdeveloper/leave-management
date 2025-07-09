import pool from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("select * from users where email = ?", [
      email,
    ]);

    console.log("rows", rows);
    if (rows.length == 0) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const signupController = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hasPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "insert into users (name, email, password_hash, role) values (?, ?, ?, ?)",
      [name, email, hasPassword, "admin"]
    );
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};
