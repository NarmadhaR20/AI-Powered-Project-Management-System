import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")} className="clickable">
        <img src={logo} alt="Aether Logo" style={{ height: '40px', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' }} />
        <h3 style={{ color: "var(--text-primary)", fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '18px' }}>
          Aether <span style={{ color: 'var(--primary)', fontWeight: '400' }}>Agile</span>
        </h3>
      </div>
      {isLoggedIn && (
        <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
