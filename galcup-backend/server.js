const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');
require('dotenv').config();

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 데이터베이스 연결 테스트
testConnection();

// 라우트 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/galcups', require('./routes/galcup'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('갈드컵 API 서버가 실행 중입니다!');
});

// 환경 변수에서 포트 설정
const PORT = process.env.PORT || 5000;

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});