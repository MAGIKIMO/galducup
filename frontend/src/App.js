import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import NavBar from './component/NavBar';
import AllGalcups from './component/AllGalcups';
import CreateGalcup from './component/CreateGalcup';
import bestGalcup from './component/bestGalcup'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <NavBar />
        <Routes>
          <Route path="/" element={<AllGalcups />} />
          <Route path="/createGalcup" element={<CreateGalcup />} />
          <Route path="/bestGalcup" element={<bestGalcup />} />
          <Route path="/nowGalcup" element={<CreateGalcup />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
