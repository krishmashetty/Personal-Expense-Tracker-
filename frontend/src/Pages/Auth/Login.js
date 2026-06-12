import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import { getErrorMessage } from "../../utils/errorHandler";
import "./auth.css";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/");
  }, [navigate]);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, values);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        // Route based on avatar status
        if (!data.user.isAvatarImageSet || !data.user.avatarImage) {
          navigate("/setAvatar");
        } else {
          navigate("/");
        }
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

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-forgot">
            <Link to="/forgotPassword" className="auth-link" style={{ fontSize: "0.82rem" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
