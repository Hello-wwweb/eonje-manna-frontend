import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import StackedTab from './components/sidebar/StackedTab';
import NavScrollExample from './components/sidebar/TopBar';

import GroupPage from './pages/GroupPage';
import GroupDetailPage from './pages/GroupDetailPage';

import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';

import { AuthProvider } from './context/AuthContext';
import { AxiosInterceptor } from './axiosInstance';


import PlaceDetailPage from './pages/PlaceDetailPage';
import CalendarPage from './pages/calendar';
import SignupPage from './pages/SignupPage';

import DashboardPage from './pages/DashboardPage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <AxiosInterceptor>
    <div className="App">
      
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
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/places/:id" element={<PlaceDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />}/>
            <Route path="/dashboard" element={<DashboardPage />}/>

            <Route path="/place" element={<PlaceDetailPage />}/>

            <Route path="/" element={<div>Welcome! Select a tab to view content.</div>} />
          </Routes>
        </div>
      
    </div>
    </AxiosInterceptor>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
