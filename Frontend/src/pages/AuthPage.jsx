import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // --- State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kelamin, setKelamin] = useState("");

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data.message || "Login gagal");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !tanggalLahir || !alamat || !kelamin) {
      return alert("Semua field wajib diisi!");
    }
    try {
      await API.post("/auth/register", {
        username,
        email,
        password,
        tanggalLahir,
        alamat,
        kelamin,
      });
      alert("Registrasi berhasil, silakan login");
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data.message || "Registrasi gagal");
    }
  };

  return (
    <div className="container">
  {/* Header */}
  <header className="toolbar">
    <h1 className="page-title">{isLogin ? "Login" : "Register"}</h1>
    <div style={{ display: "flex", gap: 12 }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  </header>

  {/* Card Form */}
  <div className="max-w-md mx-auto card pad fade-in mt-10 space-y-6 hover:shadow-lg">
    {isLogin ? (
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary hover:bg-blue-600">
            Login
          </button>
        </div>

        <p className="text-center text-slate-600">
          Belum punya akun?{" "}
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </p>
      </form>
    ) : (
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Tanggal Lahir:</label>
          <input
            type="date"
            value={tanggalLahir}
            onChange={(e) => setTanggalLahir(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Alamat:</label>
          <input
            type="text"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label>Jenis Kelamin:</label>
          <select
            value={kelamin}
            onChange={(e) => setKelamin(e.target.value)}
            required
            className="select"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn btn-success hover:bg-green-600">
            Register
          </button>
        </div>

        <p className="text-center text-slate-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </p>
      </form>
    )}
  </div>
</div>
  );
}