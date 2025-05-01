import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import { FiBook, FiCalendar, FiUsers, FiMessageSquare, FiEdit, FiRefreshCw, FiPlus, FiBarChart2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    events: 0,
    users: 0,
    feedbacks: 0,
    updatedBlogs: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [updatedBlogs, setUpdatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, blogsRes, updatedBlogsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/blogs?limit=4'),
          api.get('/admin/blogs/updated?limit=4')
        ]);
        
        setStats(statsRes.data);
        setRecentBlogs(blogsRes.data);
        setUpdatedBlogs(updatedBlogsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const statCards = [
    { 
      title: "Total Blogs", 
      value: stats.blogs, 
      icon: <FiBook className="text-blue-500" />,
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    { 
      title: "Updated Blogs", 
      value: stats.updatedBlogs, 
      icon: <FiRefreshCw className="text-orange-500" />,
      color: "bg-orange-100",
      textColor: "text-orange-600"
    },
    { 
      title: "Total Events", 
      value: stats.events, 
      icon: <FiCalendar className="text-green-500" />,
      color: "bg-green-100",
      textColor: "text-green-600"
    },
    { 
      title: "Total Users", 
      value: stats.users, 
      icon: <FiUsers className="text-purple-500" />,
      color: "bg-purple-100",
      textColor: "text-purple-600"
    },
    { 
      title: "Feedbacks", 
      value: stats.feedbacks, 
      icon: <FiMessageSquare className="text-yellow-500" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Sidebar Toggle */}
      <MobileSidebarToggle onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mental Health CMS Dashboard</h1>
              <p className="text-gray-600">Manage educational content and community engagement</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center"
            >
              <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm font-medium">Admin</span>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all ${card.color} bg-opacity-30 backdrop-blur-sm`}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <h3 className={`text-2xl font-bold ${card.textColor}`}>{card.value}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Blog Posts */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-xl font-semibold text-gray-800">Recent Articles</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/blogs')}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View All <FiPlus className="ml-1" />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {recentBlogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 text-center"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <FiBook className="text-blue-400 text-2xl" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No articles yet</h3>
                    <p className="mt-1 text-gray-500">Create your first mental health article</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/blogs/create')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Create Article
                    </motion.button>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {recentBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-6 py-4 flex flex-col md:flex-row">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Published
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <FiEdit className="mr-1" /> Edit
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Recently Updated */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50">
                <h2 className="text-xl font-semibold text-gray-800">Recently Updated</h2>
                <span className="text-sm text-gray-500">{updatedBlogs.length} updated</span>
              </div>
              
              <AnimatePresence>
                {updatedBlogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 text-center"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                      <FiRefreshCw className="text-purple-400 text-2xl" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No updates yet</h3>
                    <p className="mt-1 text-gray-500">Updated content will appear here</p>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {updatedBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Updated
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            Last updated: {new Date(blog.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              View Changes <FiPlus className="ml-1" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiEdit className="text-lg" />
                </div>
                <h3 className="text-lg font-medium">Create New Article</h3>
              </div>
              <p className="text-gray-600 mb-4">Share mental health knowledge with your community.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/blogs/create')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Write Article
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiCalendar className="text-lg" />
                </div>
                <h3 className="text-lg font-medium">Add Wellness Event</h3>
              </div>
              <p className="text-gray-600 mb-4">Organize mental health workshops or webinars.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/events/create')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Schedule Event
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FiBarChart2 className="text-lg" />
                </div>
                <h3 className="text-lg font-medium">View Insights</h3>
              </div>
              <p className="text-gray-600 mb-4">Analyze engagement with your mental health content.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/analytics')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                See Analytics
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;