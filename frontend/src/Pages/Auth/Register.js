import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";
import { getErrorMessage } from "../../utils/errorHandler";
import "./auth.css";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.isAvatarImageSet && user.avatarImage) {
        navigate("/");
      } else {
        navigate("/setAvatar");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(registerAPI, values);
      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/setAvatar");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      toast.error(getErrorMessage(err), toastOptions);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <AccountBalanceWalletIcon sx={{ fontSize: 24, color: "#6366f1" }} />
          </div>
          <span className="auth-logo-text">FinanceFlow</span>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Start tracking your finances today</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Full name</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <PersonIcon sx={{ fontSize: 18 }} />
              </span>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={values.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <EmailIcon sx={{ fontSize: 18 }} />
              </span>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <LockIcon sx={{ fontSize: 18 }} />
              </span>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            style={{ marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
