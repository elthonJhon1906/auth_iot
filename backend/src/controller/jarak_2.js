
import db from "../config/db.js"

const jarak_2_controller = {
    create: async (req, res) => {
  let { jarak, status } = req.body;

  // Parse distance ke integer
  let distance = parseInt(jarak, 10);

  // Validasi
  if (isNaN(distance) || !status) {
    return res.status(400).json({ message: "Data tidak lengkap atau salah format" });
  }

  const sql = "INSERT INTO jarak_2 (jarak, status) VALUES (?, ?)";
  db.query(sql, [distance, status], (err, result) => {
    if (err) return res.status(500).json({ err : err });

    res.json({ message: "Data tersimpan", id: result.insertId });
  });
},

findAll: async (req, res) => {
  const sql = "SELECT * FROM jarak_2 ORDER BY created_at DESC LIMIT 50"; // ambil max 50 data terakhir
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}
}

export default jarak_2_controller;