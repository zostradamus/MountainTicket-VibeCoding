const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    tanggalLahir: String,
    alamat: String,
    kelamin: String // "L" / "P"
});

module.exports = mongoose.model("User", UserSchema);
