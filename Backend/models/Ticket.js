const mongoose = require("mongoose");

const PendakiSchema = new mongoose.Schema({
    name: String,
    usia: Number,
    tanggalLahir: String,
    alamat: String,
    kelamin: String,
    identityImage: String
});

const TicketSchema = new mongoose.Schema({
  userId: String,
  gunung: { _id: String, name: String, price: Number },
  jumlahPendaki: Number,
  tanggalPendakian: String,
  identityImage: String,
  pendakiLain: [PendakiSchema],
  paymentStatus: { type: String, default: "pending" },
}, { timestamps: true });

// Virtual untuk menampilkan waktu WIB
TicketSchema.virtual("createdAtWIB").get(function() {
  return this.createdAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
});

TicketSchema.virtual("updatedAtWIB").get(function() {
  return this.updatedAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
});

TicketSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

TicketSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Ticket", TicketSchema);
