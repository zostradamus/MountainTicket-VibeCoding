import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [gunungs, setGunungs] = useState([]);

  const fetchGunungs = async () => {
    try {
      const res = await API.get("/gunung");
      setGunungs(res.data);
    } catch (err) {
      alert(err.response?.data.message || "Gagal ambil data gunung");
    }
  };

  useEffect(() => {
    fetchGunungs();
  }, []);

  // Handler logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token kalau ada
    navigate("/auth"); // arahkan ke AuthPage.jsx
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="toolbar">
        <h1 className="page-title">🌋 Daftar Gunung</h1>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/my-tickets")}
          >
            My Tickets
          </button>
          <button
            className="btn bg-gray-300 hover:bg-gray-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Grid Gunung */}
      <div className="grid fade-in" style={{ marginTop: 20 }}>
        {gunungs.map((g) => (
          <div
            key={g._id}
            className="card pad dashboard-card cursor-pointer"
            onClick={() => navigate(`/gunung/${g._id}`)}
          >
            <img
              src={`http://localhost:5000/uploads/gunung/1764177524219-RanuKumbolo.jpg`}
              alt={g.name}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="text-xl font-semibold mb-2">{g.name}</h2>
            <p className="text-slate-600">Gunung indah dengan panorama menawan.</p>
          </div>
        ))}
        {gunungs.length === 0 && (
          <div className="card pad text-center text-slate-500">
            Tidak ada gunung tersedia.
          </div>
        )}
      </div>
    </div>
  );
}