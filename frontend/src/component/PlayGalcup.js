import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './css/PlayGalcup.css';

function PlayGalcup() {
  const { id } = useParams();
  const [galcup, setGalcup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchGalcup = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/galcups/${id}`);
        setGalcup(response.data.galcup);
      } catch (err) {
        console.error('갈드컵 조회 오류:', err);
        setError('갈드컵 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalcup();
  }, [id]);

  const handleSelectImage = async (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowResult(true);
    
    try {
      // 선택 결과 저장 (옵션)
      await axios.post('http://localhost:5000/api/galcups/vote', {
        galcupId: id,
        winnerImage: imageUrl,
        userId: localStorage.getItem('userId') || null
      });
    } catch (err) {
      console.error('투표 저장 오류:', err);
      // 사용자 경험을 위해 오류는 표시하지 않고 로그만 남김
    }
  };

  const handlePlayAgain = () => {
    setSelectedImage(null);
    setShowResult(false);
  };

  if (loading) return <div className="loading-container">갈드컵 로딩 중...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!galcup) return <div className="error-container">갈드컵을 찾을 수 없습니다.</div>;

  return (
    <div className="play-galcup-container">
      <h1 className="galcup-title">{galcup.title}</h1>
      
      {!showResult ? (
        <>
          <div className="vs-container">
            <div className="vs-text">VS</div>
            <div className="images-container">
              <div 
                className="image-option"
                onClick={() => handleSelectImage(galcup.image1_url)}
              >
                <img 
                  src={`http://localhost:5000${galcup.image1_url}`} 
                  alt="이미지 1" 
                />
              </div>
              
              <div 
                className="image-option"
                onClick={() => handleSelectImage(galcup.image2_url)}
              >
                <img 
                  src={`http://localhost:5000${galcup.image2_url}`} 
                  alt="이미지 2" 
                />
              </div>
            </div>
            <div className="instruction">선호하는 이미지를 클릭하세요</div>
          </div>
        </>
      ) : (
        <div className="result-container">
          <h2 className="result-title">당신의 선택</h2>
          <div className="result-image">
            <img 
              src={`http://localhost:5000${selectedImage}`} 
              alt="선택한 이미지" 
            />
          </div>
          <div className="result-actions">
            <button className="play-again-button" onClick={handlePlayAgain}>
              다시 플레이
            </button>
            <Link to="/" className="back-button">
              다른 갈드컵 보기
            </Link>
          </div>
        </div>
      )}
      
      <div className="galcup-info">
        <p>제작자: {galcup.creator_name}</p>
        <p>생성일: {new Date(galcup.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default PlayGalcup;