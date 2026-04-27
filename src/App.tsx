import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import JobsFeed from './pages/JobsFeed';
import Bookmarks from './pages/Bookmarks';
import Freelance from './pages/Freelance';
import ResumeTools from './pages/ResumeTools';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsFeed />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="freelance" element={<Freelance />} />
          <Route path="resume" element={<ResumeTools />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
