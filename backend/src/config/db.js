import mysql from "mysql2"

// koneksi DB (contoh MySQL)
 const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tebing123",
  database: "auth_iot",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("Database connected");
});

const SECRET_JWT = "auth_iot";

export default db;