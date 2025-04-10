import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/AllGalcups.css';

function AllGalcups() {
  const [galcups, setGalcups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGalcups = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/galcups/all');
        setGalcups(response.data.galcups);
      } catch (err) {
        console.error('갈드컵 조회 오류:', err);
        setError('갈드컵 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalcups();
  }, []);

  if (loading) return <div className="loading-container">갈드컵 로딩 중...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="all-galcups-container">
      <h1>모든 갈드컵</h1>
      
      {galcups.length === 0 ? (
        <div className="no-galcups">
          <p>아직 생성된 갈드컵이 없습니다.</p>
          <Link to="/createGalcup" className="create-button">갈드컵 만들기</Link>
        </div>
      ) : (
        <div className="galcups-grid">
          {galcups.map(galcup => (
            <Link to={`/play/${galcup.id}`} key={galcup.id} className="galcup-card">
              <div className="galcup-title">{galcup.title}</div>
              <div className="galcup-images">
                <div className="galcup-image">
                  <img 
                    src={`http://localhost:5000${galcup.image1_url}`} 
                    alt={`${galcup.title} 이미지 1`} 
                  />
                </div>
                <div className="vs-badge">VS</div>
                <div className="galcup-image">
                  <img 
                    src={`http://localhost:5000${galcup.image2_url}`} 
                    alt={`${galcup.title} 이미지 2`} 
                  />
                </div>
              </div>
              <div className="galcup-footer">
                <span className="galcup-creator">제작자: {galcup.creator_name}</span>
                <span className="galcup-date">
                  {new Date(galcup.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllGalcups;