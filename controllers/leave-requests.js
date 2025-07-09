import pool from "../db/index.js";

export const adminLeaveRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `select lr.*, u.name as employee_name, lt.name as leave_type_name FROM leave_requests lr
         JOIN users u ON lr.user_id = u.id
         JOIN leave_types lt ON lr.leave_type_id = lt.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const employeeLeaveRequest = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lr.*, lt.name as leave_type_name FROM leave_requests lr
         JOIN leave_types lt ON lr.leave_type_id = lt.id
         WHERE lr.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const employeeLeavePost = async (req, res) => {
  const { leave_type_id, start_date, end_date, reason } = req.body;
  if (!leave_type_id || !start_date || !end_date || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    await pool.query(
      "INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, leave_type_id, start_date, end_date, reason]
    );
    res.status(201).json({ message: "Leave request submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const employeeEditLeave = async (req, res) => {
  const { id } = req.params;
  const { leave_type_id, start_date, end_date, reason } = req.body;
  try {
    // Only allow editing if status is Pending and belongs to user
    const [rows] = await pool.query(
      'SELECT * FROM leave_requests WHERE id = ? AND user_id = ? AND status = "Pending"',
      [id, req.user.id]
    );
    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Cannot edit this leave request" });
    }
    await pool.query(
      "UPDATE leave_requests SET leave_type_id = ?, start_date = ?, end_date = ?, reason = ? WHERE id = ?",
      [leave_type_id, start_date, end_date, reason, id]
    );
    res.json({ message: "Leave request updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const employeeDeletePending = async (req, res) => {
  const { id } = req.params;
  try {
    // deleting only for status is pending and belongs to user
    const [rows] = await pool.query(
      'SELECT * FROM leave_requests WHERE id = ? AND user_id = ? AND status = "Pending"',
      [id, req.user.id]
    );
    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Cannot delete this leave request" });
    }
    await pool.query("DELETE FROM leave_requests WHERE id = ?", [id]);
    res.json({ message: "Leave request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const adminApproveRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    await pool.query("UPDATE leave_requests SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ message: `Leave request ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
