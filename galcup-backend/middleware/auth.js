const jwt = require('jsonwebtoken');

// JWT 인증 미들웨어
module.exports = (req, res, next) => {
  // 헤더에서 토큰 가져오기
  const token = req.header('x-auth-token');
  
  // 토큰이 없는 경우
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 없습니다. 로그인이 필요합니다.' });
  }
  
  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // 요청 객체에 사용자 정보 추가
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};