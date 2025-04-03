import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Auth.css';
import { authAPI } from '../services/api';
import { AuthContext } from '../App';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 필드 변경 시 해당 필드 오류 지우기
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // API 오류 지우기
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setApiError('');
      
      try {
        // 로그인 API 호출
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // AuthContext의 login 함수 호출하여 상태 업데이트
        login(response.user, response.token);
        
        // 메인 페이지로 이동
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
        setApiError(error.message || '로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>로그인</h2>
        
        {apiError && (
          <div className="error-alert">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 주소 입력"
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              className={errors.password ? 'error' : ''}
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="remember-forgot">
            <label className="remember-me">
              <input type="checkbox" disabled={loading} /> 로그인 상태 유지
            </label>
            <Link to="/forgot-password" className="forgot-password">비밀번호 찾기</Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          
          <div className="auth-footer">
            <p>계정이 없으신가요? <Link to="/register">회원가입</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;