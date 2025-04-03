import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header-container">
      <header>
        <h1>갈드컵</h1>
      </header>
      
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="user-info">
            <span className="user-greeting">안녕하세요, {user.username}님!</span>
            <button 
              className="auth-button-nav logout-button-nav" 
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link to="/login" className="auth-button-nav">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;