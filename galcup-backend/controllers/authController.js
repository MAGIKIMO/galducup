const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 회원가입 컨트롤러
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 필수 필드 검증
    if (!username || !email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    
    // 이메일 형식 검증
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '유효한 이메일 주소를 입력해주세요.' });
    }
    
    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }
    
    // 사용자 등록
    const user = await User.register(username, email, password);
    
    // 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || '회원가입 처리 중 오류가 발생했습니다.' });
  }
};

// 로그인 컨트롤러
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
    }
    
    // 이메일로 사용자 찾기
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 비밀번호 확인
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '로그인 처리 중 오류가 발생했습니다.' });
  }
};

// 현재 사용자 정보 조회
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: '사용자 정보 조회 중 오류가 발생했습니다.' });
  }
};