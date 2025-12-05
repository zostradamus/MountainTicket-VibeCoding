import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState({
    tanggalPendakian: "",
    jumlahPendaki: 1,
    pendaki: [],
    identityFile: null,
  });

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/ticket/${id}`);
      setTicket(res.data);
      setForm({
        tanggalPendakian: res.data.tanggalPendakian,
        jumlahPendaki: res.data.jumlahPendaki,
        pendaki: res.data.pendakiLain || [],
        identityFile: null
      });
    } catch (err) {
      alert(err.response?.data.message || "Gagal ambil tiket");
    }
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handlePendakiChange = (index, field, value) => {
    const newPendaki = [...form.pendaki];
    newPendaki[index][field] = value;
    setForm({ ...form, pendaki: newPendaki });
  };

  const handleJumlahPendakiChange = (e) => {
    const jumlah = parseInt(e.target.value);
    const pendakiArr = Array(jumlah - 1).fill({ nama: "", tanggalLahir: "", alamat: "", kelamin: "", ktpFile: null });
    setForm({ ...form, jumlahPendaki: jumlah, pendaki: pendakiArr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("tanggalPendakian", form.tanggalPendakian);
    data.append("jumlahPendaki", form.jumlahPendaki);
    if (form.identityFile) data.append("identity", form.identityFile);
    if (form.pendaki.length > 0) {
      data.append("pendakiLain", JSON.stringify(form.pendaki.map(p => ({
        nama: p.nama,
        tanggalLahir: p.tanggalLahir,
        alamat: p.alamat,
        kelamin: p.kelamin
      }))));
      form.pendaki.forEach(p => {
        if (p.ktpFile) data.append("pendakiImages", p.ktpFile);
      });
    }

    try {
      await API.patch(`/ticket/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Tiket berhasil diperbarui!");
      navigate("/my-tickets");
    } catch (err) {
      alert(err.response?.data.message || "Gagal update tiket");
    }
  };

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="container">
  <div className="max-w-xl mx-auto card pad fade-in mt-10 space-y-6">
    {/* Judul */}
    <h2 className="text-2xl font-bold text-center">Edit Ticket</h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Tanggal Pendakian:</label>
        <input
          type="date"
          value={form.tanggalPendakian}
          onChange={(e) =>
            setForm({ ...form, tanggalPendakian: e.target.value })
          }
        />
      </div>

      <div>
        <label>Jumlah Pendaki:</label>
        <input
          type="number"
          min={1}
          value={form.jumlahPendaki}
          onChange={handleJumlahPendakiChange}
        />
      </div>

      <div>
        <label>KTP Pendaki Utama:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, identityFile: e.target.files[0] })
          }
        />
      </div>

      {/* Data Pendaki tambahan */}
      {form.pendaki.map((p, idx) => (
        <div key={idx} className="space-y-3">
          <h3 className="text-lg font-bold text-blue-600">
            Pendaki {idx + 2}
          </h3>

          <div>
            <label>Nama:</label>
            <input
              placeholder="Nama"
              value={p.nama}
              onChange={(e) =>
                handlePendakiChange(idx, "nama", e.target.value)
              }
            />
          </div>

          <div>
            <label>Tanggal Lahir:</label>
            <input
              type="date"
              value={p.tanggalLahir}
              onChange={(e) =>
                handlePendakiChange(idx, "tanggalLahir", e.target.value)
              }
            />
          </div>

          <div>
            <label>Alamat:</label>
            <input
              placeholder="Alamat"
              value={p.alamat}
              onChange={(e) =>
                handlePendakiChange(idx, "alamat", e.target.value)
              }
            />
          </div>

          <div>
            <label>Jenis Kelamin:</label>
            <select
              value={p.kelamin}
              onChange={(e) =>
                handlePendakiChange(idx, "kelamin", e.target.value)
              }
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label>KTP Pendaki {idx + 2}:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handlePendakiChange(idx, "ktpFile", e.target.files[0])
              }
            />
          </div>
        </div>
      ))}

      {/* Tombol Submit */}
      <div className="flex justify-center">
        <button type="submit" className="btn btn-primary">
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
