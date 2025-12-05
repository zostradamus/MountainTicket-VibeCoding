const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const Ticket = require("../models/Ticket");
const Gunung = require("../models/Gunung");

const router = express.Router();

// --- MULTER UPLOAD ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/identitas"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- BELI TIKET ---
router.post(
  "/buy",
  auth,
  upload.fields([
    { name: "identity", maxCount: 1 },
    { name: "pendakiImages", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const { jumlahPendaki, tanggalPendakian, pendakiLain, gunungId } = req.body;

      if (!jumlahPendaki) return res.status(400).json({ message: "Jumlah pendaki wajib diisi" });
      if (!tanggalPendakian) return res.status(400).json({ message: "Tanggal pendakian wajib diisi" });
      if (!gunungId) return res.status(400).json({ message: "Gunung harus dipilih" });
      if (!req.files["identity"]?.[0]) return res.status(400).json({ message: "File KTP wajib diupload" });

      const gunung = await Gunung.findById(gunungId);
      if (!gunung) return res.status(404).json({ message: "Gunung tidak ditemukan" });

      const pendakiArr = jumlahPendaki > 1 ? JSON.parse(pendakiLain) : [];
      const pendakiKtp = req.files["pendakiImages"] || [];
      const baseUrl = req.protocol + "://" + req.get("host");

      const pendakiFinal = pendakiArr.map((p, idx) => ({
        ...p,
        identityImage: pendakiKtp[idx] ? `${baseUrl}/uploads/identitas/${pendakiKtp[idx].filename}` : null
      }));

      const ticket = await Ticket.create({
        userId: req.user.userId,
        gunung: { _id: gunung._id, name: gunung.name, price: gunung.price },
        jumlahPendaki,
        tanggalPendakian,
        identityImage: `${baseUrl}/uploads/identitas/${req.files["identity"][0].filename}`,
        pendakiLain: pendakiFinal
      });

      res.json({ success: true, ticket });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// --- LIHAT TIKET USER SENDIRI ---
router.get("/my", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.userId }).lean();
    const ticketsWIB = tickets.map(ticket => {
      const createdAtWIB = new Date(ticket.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      const updatedAtWIB = new Date(ticket.updatedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      return {
        ...ticket,
        id: ticket._id,
        createdAtWIB,
        updatedAtWIB,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
        _id: undefined
      };
    });
    res.json(ticketsWIB);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DETAIL TIKET ---
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Tiket tidak ditemukan" });

    const baseUrl = req.protocol + "://" + req.get("host");
    const ticketWithUrls = {
      ...ticket.toObject(),
      identityImage: ticket.identityImage
        ? `${baseUrl}/uploads/identitas/${ticket.identityImage.split("/").pop()}`
        : null,
      pendakiLain: ticket.pendakiLain.map(p => ({
        ...p.toObject(),
        identityImage: p.identityImage
          ? `${baseUrl}/uploads/identitas/${p.identityImage.split("/").pop()}`
          : null
      }))
    };
    res.json(ticketWithUrls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- BAYAR TIKET ---
router.post("/pay/:id", auth, async (req, res) => {
  try {
    const { method } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Tiket tidak ditemukan" });
    if (ticket.paymentStatus === "paid") return res.status(400).json({ message: "Tiket sudah dibayar" });

    ticket.paymentStatus = "paid";
    ticket.payment = {
      method,
      amount: ticket.gunung.price,
      paidAt: new Date()
    };
    await ticket.save();

    res.json({ success: true, message: "Pembayaran berhasil", ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DETAIL PAYMENT ---
router.get("/:id/payment", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Tiket tidak ditemukan" });

    res.json({
      ticketId: ticket._id,
      gunung: ticket.gunung,
      paymentStatus: ticket.paymentStatus,
      payment: ticket.payment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- EDIT TIKET ---
router.patch("/:id", auth, upload.fields([
  { name: "identity", maxCount: 1 },
  { name: "pendakiImages", maxCount: 20 },
]), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Tiket tidak ditemukan" });
    if (ticket.paymentStatus === "paid") return res.status(400).json({ message: "Tiket sudah dibayar, tidak bisa diubah" });

    const { jumlahPendaki, tanggalPendakian, pendakiLain } = req.body;
    const baseUrl = req.protocol + "://" + req.get("host");

    if (jumlahPendaki) ticket.jumlahPendaki = jumlahPendaki;
    if (tanggalPendakian) ticket.tanggalPendakian = tanggalPendakian;

    // Update file identitas jika ada
    if (req.files["identity"]?.[0]) {
      ticket.identityImage = `${baseUrl}/uploads/identitas/${req.files["identity"][0].filename}`;
    }

    // Update pendakiLain jika ada
    if (pendakiLain) {
      const pendakiArr = jumlahPendaki > 1 ? JSON.parse(pendakiLain) : [];
      const pendakiKtp = req.files["pendakiImages"] || [];
      ticket.pendakiLain = pendakiArr.map((p, idx) => ({
        ...p,
        identityImage: pendakiKtp[idx] ? `${baseUrl}/uploads/identitas/${pendakiKtp[idx].filename}` : null
      }));
    }

    await ticket.save();
    res.json({ success: true, message: "Tiket berhasil diperbarui", ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
