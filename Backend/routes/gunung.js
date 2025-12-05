const express = require("express");
const multer = require("multer");
const Gunung = require("../models/Gunung");
const router = express.Router();
const path = require("path");

// --- MULTER UPLOAD GAMBAR GUNUNG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/gunung"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// --- GET SEMUA GUNUNG (BERANDA) ---
router.get("/", async (req, res) => {
  try {
    const gunungs = await Gunung.find();
    res.json(gunungs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- GET DETAIL GUNUNG ---
router.get("/:id", async (req, res) => {
  try {
    const gunung = await Gunung.findById(req.params.id);
    if (!gunung) return res.status(404).json({ message: "Gunung tidak ditemukan" });
    res.json(gunung);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- TAMBAH GUNUNG (ADMIN / TESTING) ---
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, location, difficulty, price } = req.body;
    const image = req.file ? `/uploads/gunung/${req.file.filename}` : null;

    const gunung = await Gunung.create({
      name,
      description,
      location,
      difficulty,
      price,
      image
    });

    res.json({ success: true, gunung });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE gunung by ID
router.delete("/:id", async (req, res) => {
  try {
    const gunung = await require("../models/Gunung").findById(req.params.id);
    if (!gunung) return res.status(404).json({ message: "Gunung tidak ditemukan" });

    await gunung.deleteOne();

    res.json({ success: true, message: "Gunung berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
