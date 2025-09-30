import { SECRET_JWT } from "../config/config.js";
import db from "../config/db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const userController = {
    register: async(req, res) => {

    const {username, password, role} = req.body;
        if(!username || !password || !role){
             return res.status(400).json({message: "Data tidak lengkap"})
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const sql = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
    db.query(sql, [username, hashedPassword, role], (err, result) =>{
        if(err) {
            console.error("SQL Error:", err);  // <-- Tambahkan ini
            return res.status(500).json({
                error : err
            })
        }
        res.json({message : 'user registered', id_user: result.insertId})
    })
  },

    login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) 
      return res.status(400).json({ message: "Data tidak lengkap" });

    const sql = "SELECT * FROM user WHERE username = ?";
    db.query(sql, [username], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });

      const user = result[0];
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Password incorrect" });

      // Ambil IP user
      let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if(userIp === '::1') userIp = '127.0.0.1';

      // Insert ke tabel log
      const logSql = "INSERT INTO log (id_user, ip_address) VALUES (?, ?)";
      db.query(logSql, [user.id_user, userIp], (err2, logResult) => {
        if (err2) console.error("Failed to log user login:", err2);
      });

      // Buat token JWT
      const token = jwt.sign(
        { id_user: user.id_user, username: user.username, role: user.role },
        SECRET_JWT,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login Success", token , role: user.role });
    });
  },

  findLog: async(req, res) =>{

    const id = parseInt(req.params.id);
    const sql = `
      SELECT 
      u.id_user,
      u.username,
      u.role,
      l.id_log,
      l.ip_address,
      l.created_at
    FROM user u
    LEFT JOIN log l ON u.id_user = l.id_user
    WHERE u.id_user = ?
    ORDER BY l.created_at DESC;
  `;;
        
       db.query(sql, id, (err, result) =>{
        if(err){
            return res.status(500).json({error: err});
        }
        res.status(200).json({message: "Data GET Successfully",
            data: result
        })
       })
    },

    findAll: async(req, res) =>{
      const sql = "SELECT id_user, username, role FROM user";

      db.query(sql, (err, result) =>{
        if(err){
          return res.status(500).json({error: err})
        }

        res.status(200).json({message: "Data GET Successfully", data: result})
      })
    },

    update: async(req, res) =>{
      const id = parseInt(req.params.id);
      const {username, role} = req.body;
      const sql = "UPDATE user SET username = ?, role = ? where id_user = ? ";
      
      if(!username || !role){
        return res.status(400).json({message: "field tidak boleh kosong"})
      }

      const params = [username, role];

      db.query(sql, params, (err, result) =>{
        if(err){
          return res.status(500).json({error : err})
        }

        if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
      }

       res.status(200).json({ message: "User berhasil diperbarui" });
      })
    }
}