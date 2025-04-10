import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/CreateGalcup.css';

function CreateGalcup() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // 이미지 파일 선택 핸들러
    const handleImage1Change = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage1(file);
            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview1(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImage2Change = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage2(file);
            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview2(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!title.trim()) {
            setError('갈드컵 제목을 입력해주세요');
            return;
        }
        
        if (!image1 || !image2) {
            setError('두 개의 이미지를 모두 업로드해주세요');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append('title', title);
            formData.append('image1', image1);
            formData.append('image2', image2);
            formData.append('userId', localStorage.getItem('userId') || '1'); // 로그인된 사용자 ID
            
            // API 호출
            const response = await axios.post('http://localhost:5000/api/galcups/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            
            alert('갈드컵이 성공적으로 생성되었습니다!');
            navigate('/'); // 메인 페이지로 이동
        } catch (err) {
            setError(err.response?.data?.message || '갈드컵 생성 중 오류가 발생했습니다');
            console.error('갈드컵 생성 오류:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='create-galcup'>
            <h2>갈드컵 만들기</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor='title'>갈드컵 제목</label>
                    <input 
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        disabled={loading}
                        required
                    />
                </div>
                
                <div className="galcup-images">
                    <div className="image-upload-container">
                        <h3>첫 번째 이미지</h3>
                        <div className="image-preview">
                            {preview1 ? (
                                <img src={preview1} alt="첫 번째 이미지 미리보기" />
                            ) : (
                                <div className="preview-placeholder">이미지 미리보기</div>
                            )}
                        </div>
                        <input 
                            type="file"
                            id="image1"
                            accept="image/*"
                            onChange={handleImage1Change}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="vs-indicator">VS</div>
                    
                    <div className="image-upload-container">
                        <h3>두 번째 이미지</h3>
                        <div className="image-preview">
                            {preview2 ? (
                                <img src={preview2} alt="두 번째 이미지 미리보기" />
                            ) : (
                                <div className="preview-placeholder">이미지 미리보기</div>
                            )}
                        </div>
                        <input 
                            type="file"
                            id="image2"
                            accept="image/*"
                            onChange={handleImage2Change}
                            disabled={loading}
                        />
                    </div>
                </div>
                
                {/* 버튼 컨테이너 추가 */}
                <div className="button-container">
                    <button 
                        type='submit'
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? '생성 중...' : '갈드컵 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateGalcup;