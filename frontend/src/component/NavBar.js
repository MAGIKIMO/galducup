import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">모든갈드컵</Link></li>
        <li><Link to="/bestGalcup">현재 최고의 갈드컵</Link></li>
        <li><Link to="/createGalcup">갈드컵 만들기</Link></li>
        <li><Link to="/bestGalcup">과거 최고의 갈드컵보기</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;