const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  database: "kampus",
  user: "root",
  password: "",
  socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock", // Path ke MySQL socket
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Get all mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add new mahasiswa
app.post("/api/mahasiswa", (req, res) => {
  const { nama } = req.body;
  const sql = "INSERT INTO mahasiswa (nama) VALUES (?)";
  db.query(sql, [nama], (err, result) => {
    if (err) throw err;
    res.json({ message: "Mahasiswa added", id: result.insertId });
  });
});

// Update mahasiswa
app.put("/api/mahasiswa/:nim", (req, res) => {
  const { nim } = req.params;
  const { nama } = req.body;
  const sql = "UPDATE mahasiswa SET nama = ? WHERE nim = ?";
  db.query(sql, [nama, nim], (err, result) => {
    if (err) throw err;
    res.json({ message: "Mahasiswa updated" });
  });
});

// Delete mahasiswa
app.delete("/api/mahasiswa/:nim", (req, res) => {
  const { nim } = req.params;
  const sql = "DELETE FROM mahasiswa WHERE nim = ?";
  db.query(sql, [nim], (err, result) => {
    if (err) throw err;
    res.json({ message: "Mahasiswa deleted" });
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
