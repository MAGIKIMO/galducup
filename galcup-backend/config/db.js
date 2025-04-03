// 데이터베이스 연결 설정
const mysql = require('mysql2/promise');
require('dotenv').config();

// 환경 변수에서 DB 정보 가져오기
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'galcup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL 데이터베이스 연결 성공!');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL 연결 오류:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};