import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Auth.css';
import { authAPI } from '../services/api';
import { AuthContext } from '../App';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // 사용자 이름 검증
    if (!formData.username) {
      newErrors.username = '사용자 이름을 입력해주세요';
    } else if (formData.username.length < 2) {
      newErrors.username = '사용자 이름은 최소 2자 이상이어야 합니다';
    }
    
    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }
    
    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
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
        // 회원가입 API 호출
        const response = await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        // AuthContext의 login 함수 호출하여 상태 업데이트
        login(response.user, response.token);
        
        // 메인 페이지로 이동
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        setApiError(error.message || '회원가입 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        
        {apiError && (
          <div className="error-alert">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">사용자 이름</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="사용자 이름 입력"
              className={errors.username ? 'error' : ''}
              disabled={loading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
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
              placeholder="비밀번호 입력 (6자 이상)"
              className={errors.password ? 'error' : ''}
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 다시 입력"
              className={errors.confirmPassword ? 'error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="terms-checkbox">
            <label>
              <input type="checkbox" required disabled={loading} /> 이용약관 및 개인정보처리방침에 동의합니다
            </label>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
          
          <div className="auth-footer">
            <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;