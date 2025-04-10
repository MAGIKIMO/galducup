import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import NavBar from './component/NavBar';
import AllGalcups from './component/AllGalcups';
import CreateGalcup from './component/CreateGalcup';
import BestGalcup from './component/bestGalcup';
import NowGalcup from './component/nowGalcups';
import Login from './component/Login';
import Register from './component/Register';
import PlayGalcup from './component/PlayGalcup';
import { authAPI } from './services/api';

// 인증 컨텍스트 생성
export const AuthContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // 선택적: 토큰 유효성 검증을 위해 API 호출
          // const userData = await authAPI.getCurrentUser();
          // setUser(userData.user);
          
          // 간단한 버전: 로컬 스토리지 데이터 사용
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } catch (error) {
          console.error('인증 오류:', error);
          // 인증 실패 시 로컬 스토리지 정리
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkLoginStatus();
  }, []);

  // 로그인 함수
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    // 로딩 중에 표시할 내용
    return <div>로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      <Router>
        <div className="App">
          <Header />
          <NavBar />
          <Routes>
            <Route path="/" element={<AllGalcups />} />
            <Route path="/createGalcup" element={<CreateGalcup />} />
            <Route path="/bestGalcup" element={<BestGalcup />} />
            <Route path="/nowGalcup" element={<NowGalcup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/play/:id" element={<PlayGalcup />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;