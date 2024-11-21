import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import StackedTab from './components/sidebar/StackedTab';
import NavScrollExample from './components/sidebar/TobBar';

import GroupPage from './pages/GroupPage';
import GroupDetailPage from './pages/GroupDetailPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* 네비게이션 바 */}
        <div className="navBar">
          <NavScrollExample />
        </div>

        {/* 사이드바 */}
        <div className="sidebar">
          <StackedTab />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="main-content">
          <Routes>
            <Route path="/home" element={<div>Home Page</div>} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/link-2" element={<div>Link 2 Page</div>} />
            <Route path="/" element={<div>Welcome! Select a tab to view content.</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
