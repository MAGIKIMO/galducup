    import React, { useState } from 'react';
    import './css/CreateGalcup.css';
    function CreateGalcup(){
        const [title, setTitle] = useState("");
        const [items, setItems] = useState([]);
        const [newItem, setNewItem] = useState('');

        const addItem = () => {
            if(newItem.trim() !== ''){ // 공백만 있는 경우 제외
                setItems([...items, {id: Date.now(), content: newItem.trim()}]);
                setNewItem('');
            }
        };

        const removeItem = (id) => {
            setItems(items.filter(item => item.id !== id));
        }

        const submitItem = (e) => { // e 매개변수 추가
            e.preventDefault();
            if (items.length < 2){ // length는 속성이므로 ()를 제거
                alert('최소 2개 이상의 갈드컵 요소를 넣어주세요');
                return;
            }
            console.log('갈드컵 생성완료', {title, items});
        };

        return(
            <div className='create-galcup'>
                <h2>갈드컵 만들기</h2>
                <form onSubmit={submitItem}>
                    <div>
                        <label htmlFor='title'>갈드컵 제목</label>
                        <input 
                            type='text'
                            id='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='newItem'>새 항목 추가(이미지 또는 YouTube 링크):</label>
                        <input 
                            type='text'
                            id='newItem'
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <button type='button' onClick={addItem}>추가</button>
                    </div>
                    <div>
                        <h3>추가된 항목:</h3>
                        <ul>
                            {items.map((item) => (
                                <li key={item.id}>
                                    {item.content}
                                    <button type='button' onClick={() => removeItem(item.id)}>삭제</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button type='submit'>갈드컵 생성</button>
                </form>
            </div>
        )
    };

    export default CreateGalcup;
