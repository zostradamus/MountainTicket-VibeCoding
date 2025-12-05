import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/ticket/${id}`);
      setTicket(res.data);
    } catch (err) {
      alert(err.response?.data.message || "Gagal ambil detail tiket");
    }
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handleBayar = async () => {
    if (!window.confirm("Bayar tiket sekarang?")) return;
    try {
      setLoading(true);
      await API.post(`/ticket/pay/${id}`, { method: "transfer" }); // contoh method
      alert("Pembayaran berhasil!");
      fetchTicket(); // refresh status tiket
    } catch (err) {
      alert(err.response?.data.message || "Gagal membayar tiket");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
  <div className="max-w-2xl mx-auto card pad fade-in mt-10 space-y-4">
    {/* Judul */}
    <h2 className="text-2xl font-bold text-center">Detail Tiket</h2>

    {/* Informasi Tiket */}
    <p><strong>Gunung:</strong> {ticket.gunung.name}</p>
    <p><strong>Tanggal Pendakian:</strong> {ticket.tanggalPendakian}</p>
    <p><strong>Jumlah Pendaki:</strong> {ticket.jumlahPendaki}</p>
    <p>
      <strong>Status Pembayaran:</strong>{" "}
      <span
        className={
          ticket.paymentStatus === "paid"
            ? "text-green-600 font-semibold"
            : "text-yellow-600 font-semibold"
        }
      >
        {ticket.paymentStatus}
      </span>
    </p>
    <p><strong>Tanggal Dibeli:</strong> {ticket.createdAtWIB}</p>

    {/* Detail Pembayaran jika sudah paid */}
    {ticket.paymentStatus === "paid" && ticket.payment && (
      <>
        <p>
          <strong>Tanggal Bayar:</strong>{" "}
          {new Date(ticket.payment.paidAt).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          })}
        </p>
        <p><strong>Metode Pembayaran:</strong> {ticket.payment.method}</p>
        <p><strong>Jumlah Bayar:</strong> Rp {ticket.payment.amount}</p>
      </>
    )}

    {/* Tombol Bayar jika pending */}
    {ticket.paymentStatus === "pending" && (
      <div className="flex justify-center">
        <button
          onClick={handleBayar}
          disabled={loading}
          className="btn btn-success"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    )}
  </div>
</div>
  );
}
