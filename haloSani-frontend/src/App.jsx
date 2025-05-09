import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import UserLogin from './pages/User/Auth/Login';
import UserRegister from './pages/User/Auth/Register';
import UserOtpVerification from './pages/User/Auth/OtpVerification';
import UserHome from './pages/User/UserHome';
import BlogPage from './pages/Admin/BlogPage';
import EditBlogPage from './pages/Admin/EditBlogPage';
import EventCMS from './pages/Admin/EventCMS';
import EbookCMS from './pages/Admin/EbookCMS';
import WebInfo from './pages/Admin/WebInfo';
import UserProtectedRoute from './components/UserProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Blog from './pages/User/Blog';
import BlogDetail from './pages/User/BlogDetail';
import WebInfoPage from './pages/User/WebInfoPage';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/verify-otp" element={<UserOtpVerification />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/blogs" element={<BlogPage />} />
          <Route path="/admin/blogs/:id/edit" element={<EditBlogPage />} />
          <Route path="/admin/event-cms" element={<EventCMS />} />
          <Route path="/admin/ebook" element={<EbookCMS />} />
          <Route path="/admin/webinfo" element={<WebInfo />} />
        </Route>

        {/* Protected User Routes with Header + Footer */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user/dashboard" element={<UserHome />} />
          <Route path="/user/blogs" element={<Blog />} />
          <Route path="/user/blogs/:id" element={<BlogDetail />} />
          <Route path="/user/webinfopage" element={<WebInfoPage />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
