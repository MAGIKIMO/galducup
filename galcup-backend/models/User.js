const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // 사용자 등록 (회원가입)
  static async register(username, email, password) {
    try {
      // 비밀번호 해시화 (10 라운드)
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 사용자 데이터베이스에 저장
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      return {
        id: result.insertId,
        username,
        email
      };
    } catch (error) {
      // 중복 이메일 오류 확인
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('이미 등록된 이메일입니다.');
      }
      throw error;
    }
  }

  // 이메일로 사용자 찾기
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // 사용자 ID로 사용자 찾기
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 비밀번호 확인
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;