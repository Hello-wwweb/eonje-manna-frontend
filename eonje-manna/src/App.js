import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import StackedTab from './components/sidebar/StackedTab';
import NavScrollExample from './components/sidebar/TobBar';

import GroupPage from './pages/GroupPage';
import GroupDetailPage from './pages/GroupDetailPage';

import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';

import { AuthProvider } from './context/AuthContext';

import PlaceDetailPage from './pages/PlaceDetailPage';
import CalendarPage from './pages/calendar';
import SignupPage from './pages/SignupPage';
function App() {
  return (
    <AuthProvider>
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
        <div className="main-content"  style={{marginTop: "0px"}}>
          <Routes>
            <Route path="/home" element={<div>Home Page</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/Event/:id" element={<EventDetailPage />} />
            <Route path="/Place/:id" element={<PlaceDetailPage />} />
            <Route path="/link-2" element={<div>Link 2 Page</div>} />
            <Route path="calendar" element={<CalendarPage />}/>
            <Route path="/" element={<div>Welcome! Select a tab to view content.</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}

export default App;
