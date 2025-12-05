const mongoose = require("mongoose");

const GunungSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  difficulty: String,
  price: Number,
  image: String // URL / path gambar gunung
});

module.exports = mongoose.model("Gunung", GunungSchema);
