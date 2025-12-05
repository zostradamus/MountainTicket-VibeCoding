const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// KONEKSI DATABASE LOCAL
mongoose.connect("mongodb://127.0.0.1:27017/pendakian_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Pendakian berjalan...");
});

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/ticket", require("./routes/ticket"));
app.use("/gunung", require("./routes/gunung"));


// RUN SERVER
app.listen(5000, () => console.log("Server running on port 5000"));
