import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jarak_1 from "./src/routes/jarak_1.js"
import jarak_2 from "./src/routes/jarak_2.js"
import controller from "./src/routes/controller.js"
import user from "./src/routes/user.js"
const app = express();
app.use(bodyParser.json());

// izinkan semua origin
app.use(cors());

// atau kalau mau lebih spesifik:
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"]
}));


app.use("/api/distance_1", jarak_1);
app.use("/api/distance_2", jarak_2);
app.use("/api/user", user);
app.use("/api/controller", controller);

app.listen(3000, () => console.log("Server running on port 3000"));