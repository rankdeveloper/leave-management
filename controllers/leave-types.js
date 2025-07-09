import pool from "../db/index.js";

export const leaveTypes = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from leave_types");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addLeaveType = async (req, res) => {
  const { name, max_days } = req.body;
  if (!name || !max_days) {
    return res
      .status(400)
      .json({ message: "Name and Maximum days are required" });
  }
  try {
    await pool.query("insert into leave_types (name, max_days) values (?, ?)", [
      name,
      max_days,
    ]);
    res.status(201).json({ message: "Leave type created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editLeaveType = async (req, res) => {
  const { name, max_days } = req.body;
  const { id } = req.params;
  if (!name || !max_days) {
    return res.status(400).json({ message: "Name and max_days are required" });
  }
  try {
    await pool.query(
      "UPDATE leave_types SET name = ?, max_days = ? WHERE id = ?",
      [name, max_days, id]
    );
    res.json({ message: "Leave type updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteLeaveType = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("delete from leave_types WHERE id = ?", [id]);
    res.json({ message: "Leave type deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
