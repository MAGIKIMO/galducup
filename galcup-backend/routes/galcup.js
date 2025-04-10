const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

// 업로드 폴더 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // 파일명 충돌 방지를 위해 타임스탬프 추가
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 파일 필터링
const fileFilter = (req, file, cb) => {
  // 이미지 파일만 허용
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 제한
  },
  fileFilter: fileFilter
});

// 갈드컵 생성 API
router.post('/create', authMiddleware, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, userId } = req.body;
    
    // 필수 입력값 검증
    if (!title || !req.files.image1 || !req.files.image2) {
      return res.status(400).json({ message: '제목과 두 개의 이미지가 필요합니다.' });
    }
    
    // 이미지 파일 경로
    const image1Path = `/uploads/${req.files.image1[0].filename}`;
    const image2Path = `/uploads/${req.files.image2[0].filename}`;
    
    // 갈드컵 정보 저장
    const [result] = await pool.execute(
      'INSERT INTO galcups (title, image1_url, image2_url, user_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [title, image1Path, image2Path, userId]
    );
    
    res.status(201).json({
      message: '갈드컵 생성 성공',
      galcupId: result.insertId,
      title,
      image1: image1Path,
      image2: image2Path
    });
  } catch (error) {
    console.error('갈드컵 생성 오류:', error);
    res.status(500).json({ message: '갈드컵 생성 중 오류가 발생했습니다.' });
  }
});

// 모든 갈드컵 조회 API
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT g.id, g.title, g.image1_url, g.image2_url, g.created_at, 
              u.username as creator_name
       FROM galcups g
       JOIN users u ON g.user_id = u.id
       ORDER BY g.created_at DESC`
    );
    
    res.status(200).json({ galcups: rows });
  } catch (error) {
    console.error('갈드컵 조회 오류:', error);
    res.status(500).json({ message: '갈드컵 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 갈드컵 조회 API
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT g.id, g.title, g.image1_url, g.image2_url, g.created_at, 
              u.username as creator_name
       FROM galcups g
       JOIN users u ON g.user_id = u.id
       WHERE g.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '갈드컵을 찾을 수 없습니다.' });
    }
    
    res.status(200).json({ galcup: rows[0] });
  } catch (error) {
    console.error('갈드컵 조회 오류:', error);
    res.status(500).json({ message: '갈드컵 조회 중 오류가 발생했습니다.' });
  }
});

// 갈드컵 투표 API
router.post('/vote', async (req, res) => {
    try {
      const { galcupId, winnerImage, userId } = req.body;
      
      // 필수 입력값 검증
      if (!galcupId || !winnerImage) {
        return res.status(400).json({ message: '갈드컵 ID와 선택한 이미지가 필요합니다.' });
      }
      
      // 투표 결과 저장
      await pool.execute(
        'INSERT INTO votes (galcup_id, winner_image, user_id) VALUES (?, ?, ?)',
        [galcupId, winnerImage, userId]
      );
      
      res.status(201).json({
        message: '투표가 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('투표 저장 오류:', error);
      res.status(500).json({ message: '투표 저장 중 오류가 발생했습니다.' });
    }
  });

module.exports = router;
