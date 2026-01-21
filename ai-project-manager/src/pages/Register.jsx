import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-B05FPlUB.png";
import Navbar from "../components/Navbar";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    try {
      await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };


  return (
    <div className="auth-layout">
      {/* LEFT PANE - HERO */}
      <div className="auth-hero-pane">
        <div className="auth-hero-content" style={{ textAlign: 'center', color: 'white' }}>
          <img src={logo} alt="Logo" style={{ height: "120px", marginBottom: "32px", filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.1' }}>
            Build Your <br />
            <span style={{
              background: 'linear-gradient(to right, #818cf8, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'var(--text-glow)'
            }}>Dream Team</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            Join thousands of teams already using Aether to ship faster and
            better. Your journey starts here.
          </p>
        </div>
      </div>

      {/* RIGHT PANE - FORM */}
      <div className="auth-form-pane">
        <div className="glass-panel auth-card card-hover" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ color: "var(--text-primary)", fontSize: "32px", fontWeight: "700" }}>Get Started</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px" }}>Create your workspace today</p>
          </div>

          {error && <p style={{ color: "var(--status-high)", marginBottom: "16px", textAlign: "center" }}>{error}</p>}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
              style={{ width: "100%", boxSizing: "border-box", padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Work Email</label>
            <input
              type="email"
              placeholder="john@company.com"
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
              style={{ width: "100%", boxSizing: "border-box", padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
              style={{ width: "100%", boxSizing: "border-box", padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Default Role</label>
            <select
              value={form.role}
              onChange={e =>
                setForm({ ...form, role: e.target.value })
              }
              style={{ width: "100%", boxSizing: "border-box", padding: '10px' }}
            >
              <option value="USER">Standard User</option>
              <option value="GUEST">Viewer / Guest</option>
            </select>
          </div>

          <button className="btn-primary btn-full" style={{ padding: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }} onClick={handleRegister}>
            Create Account
          </button>

          <p style={{ marginTop: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
            Already have an account?{" "}
            <span
              className="text-link"
              onClick={() => navigate("/login")}
            >
              Sign in instead
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
