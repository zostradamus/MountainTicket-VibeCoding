import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ticket/my");
      setTickets(res.data);
    } catch (err) {
      alert(err.response?.data.message || "Gagal ambil tiket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
<div className="container">
  <div className="max-w-4xl mx-auto space-y-6">
    {/* Judul */}
    <h2 className="text-2xl font-bold text-center">My Tickets</h2>

    {/* Konten */}
    {loading ? (
      <div className="card pad">Loading...</div>
    ) : tickets.length === 0 ? (
      <div className="card pad text-center text-gray-600">
        Belum ada tiket yang dibooking.
      </div>
    ) : (
      <div className="table-wrap fade-in">
        <table className="table">
          <thead>
            <tr>
              <th>Gunung</th>
              <th>Tanggal Pendakian</th>
              <th>Status Pembayaran</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.gunung.name}</td>
                <td>{t.tanggalPendakian}</td>
                <td>
                  <span
                    className={`badge ${
                      t.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t.paymentStatus}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={() => navigate(`/ticket/${t.id}`)}
                    className="btn btn-outline"
                  >
                    Payment Detail
                  </button>
                  {t.paymentStatus === "pending" && (
                    <button
                      onClick={() => navigate(`/ticket-edit/${t.id}`)}
                      className="btn btn-danger"
                    >
                      Edit Ticket
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
  );
}
