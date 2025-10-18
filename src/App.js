import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import PublicJobPage from './pages/PublicJobPage';
import ViewApplications from './pages/ViewApplications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs/create" element={<CreateJob />} />
        <Route path="/jobs/:jobId/applications" element={<ViewApplications />} />
        <Route path="/apply/:username/:slug" element={<PublicJobPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;