
import db from "../config/db.js"

const controller = {
    create: async (req, res) => {
  const { tv_status } = req.body;
  const sql = "UPDATE controller SET tv_status=? WHERE id_controller = 1";
  db.query(sql, [tv_status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "LED state updated" });
  });
}, 

findAll: async (req, res) => {
  const sql = "SELECT tv_status FROM controller WHERE id_controller=1";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
}
}

export default controller;