import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./avatar.css";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import { getErrorMessage } from "../../utils/errorHandler";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const { uniqueNamesGenerator, animals, colors, countries, names, languages } = require("unique-names-generator");

const sprites = [
  "adventurer", "micah", "avataaars", "bottts", "initials",
  "adventurer-neutral", "big-ears", "big-ears-neutral", "big-smile",
  "croodles", "identicon", "miniavs", "open-peeps", "personas",
  "pixel-art", "pixel-art-neutral",
];

const randomName = () =>
  uniqueNamesGenerator({ dictionaries: [animals, colors, countries, names, languages], length: 2 });

const SetAvatar = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);
  const [imgURL, setImgURL] = useState(
    Array.from({ length: 4 }, () => `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`)
  );

  const toastOptions = {
    position: "bottom-right", autoClose: 2000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: false, draggable: true, theme: "dark",
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(stored);
    // If avatar already set, go home — don't get stuck here
    if (user.isAvatarImageSet && user.avatarImage) {
      navigate("/");
    }
  }, [navigate]);

  const handleSpriteChange = (e) => {
    const val = e.target.value;
    setSelectedSprite(val);
    setSelectedAvatar(undefined);
    setImgURL(Array.from({ length: 4 }, () => `https://api.dicebear.com/7.x/${val}/svg?seed=${randomName()}`));
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, { image: imgURL[selectedAvatar] });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar selected successfully", toastOptions);
        setTimeout(() => navigate("/"), 500);
      } else {
        toast.error("Error setting avatar, please try again", toastOptions);
      }
    } catch (err) {
      toast.error(getErrorMessage(err), toastOptions);
    }
  };

  const handleSkip = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    // Mark avatar as set locally so we don't loop back here
    user.isAvatarImageSet = true;
    user.avatarImage = "";
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="avatar-page">
      <div className="avatar-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <div style={{
            width: "40px", height: "40px", background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 20, color: "#6366f1" }} />
          </div>
          <span style={{
            fontSize: "1.1rem", fontWeight: 700,
            background: "linear-gradient(135deg, #f1f5f9, #94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>FinanceFlow</span>
        </div>

        <h1 className="avatar-heading">Choose Your Avatar</h1>
        <p className="avatar-subheading">Pick one that represents you</p>

        <div className="avatar-grid">
          {imgURL.map((image, index) => (
            <div
              key={index}
              className={`avatar-item${selectedAvatar === index ? " selected" : ""}`}
              onClick={() => setSelectedAvatar(index)}
            >
              <img src={image} alt={`avatar-${index}`} />
            </div>
          ))}
        </div>

        <div className="avatar-sprite-select">
          <label style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            Avatar Style
          </label>
          <select className="form-select" value={selectedSprite} onChange={handleSpriteChange}>
            {sprites.map((sprite) => (
              <option key={sprite} value={sprite}>{sprite}</option>
            ))}
          </select>
        </div>

        <button className="avatar-confirm-btn" onClick={setProfilePicture}>
          Set as Profile Picture
        </button>
        <button
          onClick={handleSkip}
          style={{
            width: "100%", marginTop: "0.75rem", padding: "0.6rem",
            background: "transparent", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)", color: "var(--text-muted)",
            fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
            fontFamily: "Inter, sans-serif", transition: "all 0.2s",
          }}
          onMouseOver={(e) => { e.target.style.color = "var(--text-primary)"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseOut={(e) => { e.target.style.color = "var(--text-muted)"; e.target.style.borderColor = "var(--border-color)"; }}
        >
          Skip for now
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SetAvatar;
