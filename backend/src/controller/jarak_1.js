
import db from "../config/db.js"
export const jarak_1_controller = {
  create: async(req, res) => {
  let { jarak, status } = req.body;
  let distance = parseInt(jarak, 10);  // parse dari 'jarak'
  if (isNaN(distance) || !status) {
    return res.status(400).json({ message: "Data tidak lengkap atau salah format" });
  }

  const sql = "INSERT INTO jarak_1 (jarak, status) VALUES (?, ?)";
  db.query(sql, [distance, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Data tersimpan", id: result.insertId });
  });
},

findAll: async (req, res) => {
  const sql = "SELECT * FROM jarak_1 ORDER BY created_at DESC LIMIT 50"; // ambil max 50 data terakhir
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}
}