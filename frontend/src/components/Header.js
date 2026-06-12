import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import './style.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className={`app-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-brand" onClick={() => navigate('/')}>
          <div className="brand-icon">
            <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#6366f1' }} />
          </div>
          <span className="brand-name">FinanceFlow</span>
        </div>

        <div className="header-actions">
          {user ? (
            <div className="header-user">
              {user.avatarImage && (
                <img src={user.avatarImage} alt="avatar" className="header-avatar" />
              )}
              <span className="header-username">{user.name}</span>
              <button className="header-btn header-btn-logout" onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: 16 }} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="header-btn header-btn-login" onClick={() => navigate('/login')}>
              <LoginIcon sx={{ fontSize: 16 }} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
