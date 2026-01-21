import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import logo from "../assets/logo-B05FPlUB.png";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-layout">
      {/* LEFT PANE - HERO */}
      <div className="auth-hero-pane">
        <div className="auth-hero-content" style={{ textAlign: 'center', color: 'white' }}>
          <img src={logo} alt="Logo" style={{ height: "120px", marginBottom: "32px", filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.1' }}>
            Elevate Your <br />
            <span style={{
              background: 'linear-gradient(to right, #818cf8, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'var(--text-glow)'
            }}>Productivity</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            Experience the next generation of agile management with Aether.
            Smart. Seamless. Powerful.
          </p>
        </div>
      </div>

      {/* RIGHT PANE - FORM */}
      <div className="auth-form-pane">
        <div className="glass-panel auth-card card-hover" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ color: "var(--text-primary)", fontSize: "32px", fontWeight: "700" }}>Welcome Back</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px" }}>Sign in to continue to Aether Agile</p>
          </div>

          {error && <p style={{ color: "var(--status-high)", marginBottom: "16px", textAlign: "center" }}>{error}</p>}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: '12px' }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: '12px' }}
            />
          </div>

          <button className="btn-primary btn-full" style={{ padding: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }} onClick={handleLogin}>
            Sign In
          </button>

          <p style={{ marginTop: "32px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
            Don’t have an account?{" "}
            <span className="text-link" onClick={() => navigate("/register")}>
              Create one for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
