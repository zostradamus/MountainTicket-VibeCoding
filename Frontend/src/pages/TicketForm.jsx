import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function TicketForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gunung } = location.state || {};

  const [form, setForm] = useState({
    tanggalPendakian: "",
    jumlahPendaki: 1,
    pendaki: [{ nama: "", tanggalLahir: "", alamat: "", kelamin: "", ktpFile: null }],
    identityFile: null
  });

  const handleChangePendaki = (index, field, value) => {
    const newPendaki = [...form.pendaki];
    newPendaki[index][field] = value;
    setForm({ ...form, pendaki: newPendaki });
  };

  const handleJumlahPendakiChange = (e) => {
    const jumlah = parseInt(e.target.value);
    const pendakiArr = Array.from({ length: jumlah }, (_, i) => ({
      nama: "",
      tanggalLahir: "",
      alamat: "",
      kelamin: "",
      ktpFile: null
    }));
    setForm({ ...form, jumlahPendaki: jumlah, pendaki: pendakiArr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!form.tanggalPendakian) return alert("Tanggal pendakian wajib diisi!");
    for (let i = 0; i < form.pendaki.length; i++) {
      const p = form.pendaki[i];
      if (!p.nama || !p.tanggalLahir || !p.alamat || !p.kelamin)
        return alert(`Data pendaki ke-${i + 1} belum lengkap!`);
      if (!p.ktpFile) return alert(`KTP pendaki ke-${i + 1} wajib diupload!`);
    }
    if (!form.pendaki[0].ktpFile) return alert("KTP utama wajib diupload!");

    // Siapkan FormData
    const data = new FormData();
    data.append("tanggalPendakian", form.tanggalPendakian);
    data.append("jumlahPendaki", form.jumlahPendaki);
    data.append("gunungId", gunung._id);
    data.append("identity", form.pendaki[0].ktpFile);

    if (form.jumlahPendaki > 1) {
      const pendakiData = form.pendaki.map(p => ({
        nama: p.nama,
        tanggalLahir: p.tanggalLahir,
        alamat: p.alamat,
        kelamin: p.kelamin
      }));
      data.append("pendakiLain", JSON.stringify(pendakiData.slice(1))); // Pendaki 2 dst
      form.pendaki.slice(1).forEach(p => {
        data.append("pendakiImages", p.ktpFile);
      });
    }

    try {
      await API.post("/ticket/buy", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Tiket berhasil dibooking!");
      navigate("/my-tickets");
    } catch (err) {
      alert(err.response?.data.message || "Gagal booking tiket");
    }
  };

  if (!gunung) return <p>Data gunung tidak tersedia.</p>;

  return (
    <div className="container">
  <div className="max-w-xl mx-auto card pad fade-in mt-10 space-y-6">
    {/* Judul */}
    <h2 className="text-2xl font-bold text-center">Booking Tiket: {gunung.name}</h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tanggal Pendakian */}
      <div>
        <label>Tanggal Pendakian:</label>
        <input
          type="date"
          value={form.tanggalPendakian}
          onChange={(e) =>
            setForm({ ...form, tanggalPendakian: e.target.value })
          }
          className="input"
        />
      </div>

      {/* Jumlah Pendaki */}
      <div>
        <label>Jumlah Pendaki:</label>
        <input
          type="number"
          min={1}
          value={form.jumlahPendaki}
          onChange={handleJumlahPendakiChange}
          className="input"
        />
      </div>

      {/* Data Pendaki */}
      <div className="table-wrap fade-in" style={{ overflowX: "auto" }}>
        <table className="table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Alamat</th>
              <th>Jenis Kelamin</th>
              <th>KTP</th>
            </tr>
          </thead>
          <tbody>
            {form.pendaki.map((p, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    value={p.nama}
                    onChange={(e) =>
                      handleChangePendaki(idx, "nama", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={p.tanggalLahir}
                    onChange={(e) =>
                      handleChangePendaki(idx, "tanggalLahir", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={p.alamat}
                    onChange={(e) =>
                      handleChangePendaki(idx, "alamat", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <select
                    value={p.kelamin}
                    onChange={(e) =>
                      handleChangePendaki(idx, "kelamin", e.target.value)
                    }
                    className="select"
                  >
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleChangePendaki(idx, "ktpFile", e.target.files[0])
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-center gap-3 mt-4">
        <button type="submit" className="btn btn-primary">
          Book Tiket
        </button>
        <button
          type="button"
          className="btn bg-gray-300"
          onClick={() => navigate("/dashboard")}
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
