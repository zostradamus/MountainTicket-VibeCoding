import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function GunungDetail() {
  const { id } = useParams(); // ambil id gunung dari URL
  const navigate = useNavigate();
  const [gunung, setGunung] = useState(null);

  const fetchGunung = async () => {
    try {
      const res = await API.get(`/gunung/${id}`);
      setGunung(res.data);
    } catch (err) {
      alert(err.response?.data.message || "Gagal ambil detail gunung");
    }
  };

  useEffect(() => {
    fetchGunung();
  }, [id]);

  if (!gunung) return <p className="p-5">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
  {/* Gambar Gunung */}
  <img
    className="gunung-img"
    src={`http://localhost:5000/uploads/gunung/1764177524219-RanuKumbolo.jpg`}
    alt={gunung.name}
  />

  {/* Judul */}
  <h1 className="text-3xl font-bold text-center">{gunung.name}</h1>

  {/* Detail Gunung */}
  <div className="space-y-2 text-left">
    <p><strong>Deskripsi:</strong> {gunung.description}</p>
    <p><strong>Lokasi:</strong> {gunung.location}</p>
    <p><strong>Difficulty:</strong> {gunung.difficulty}</p>
    <p><strong>Harga:</strong> Rp {gunung.price}</p>
  </div>

  {/* Tombol Aksi */}
  <div className="flex justify-center gap-3">
    <button
      className="btn btn-success"
      onClick={() => navigate(`/ticket-form/${id}`, { state: { gunung } })}
    >
      Book Ticket
    </button>
    <button
      className="btn bg-gray-300"
      onClick={() => navigate("/dashboard")}
    >
      Kembali
    </button>
  </div>
</div>
  );
}
