import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GunungDetail from "./pages/GunungDetail.jsx";
import TicketForm from "./pages/TicketForm.jsx";
import MyTickets from "./pages/MyTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import EditTicket from "./pages/EditTicket.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gunung/:id" element={<GunungDetail />} />
        <Route path="/ticket-form/:gunungId" element={<TicketForm />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/ticket-edit/:id" element={<EditTicket />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
