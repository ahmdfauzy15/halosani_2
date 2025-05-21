import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import { 
  FiBook, 
  FiCalendar, 
  FiUsers, 
  FiRefreshCw, 
  FiPlus, 
  FiBarChart2,
  FiEdit,
  FiTrendingUp
} from 'react-icons/fi';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    events: 0,
    users: 0,
    updatedBlogs: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [updatedBlogs, setUpdatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats({
          blogs: response.data.blogs,
          events: response.data.events,
          users: response.data.users,
          updatedBlogs: response.data.updatedBlogs
        });
        setRecentBlogs(response.data.recentBlogs);
        setUpdatedBlogs(response.data.updatedBlogsList);
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
      title: "Total Articles", 
      value: stats.blogs, 
      icon: <FiBook className="text-indigo-500 text-xl" />,
      color: "bg-indigo-50",
      trend: stats.blogs > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Updated Articles", 
      value: stats.updatedBlogs, 
      icon: <FiRefreshCw className="text-blue-500 text-xl" />,
      color: "bg-blue-50",
      trend: stats.updatedBlogs > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Total Events", 
      value: stats.events, 
      icon: <FiCalendar className="text-emerald-500 text-xl" />,
      color: "bg-emerald-50",
      trend: stats.events > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Registered Users", 
      value: stats.users, 
      icon: <FiUsers className="text-purple-500 text-xl" />,
      color: "bg-purple-50",
      trend: stats.users > 0 ? 'up' : 'neutral'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Sidebar Toggle */}
      {/* <MobileSidebarToggle onLogout={handleLogout} /> */}

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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              <span>Admin</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className={`${card.color} p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    card.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {card.trend === 'up' ? (
                      <>
                        <FiTrendingUp className="mr-1" />
                        Active
                      </>
                    ) : 'No activity'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Articles */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Articles</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/blogs')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
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
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                      <FiBook className="text-indigo-400 text-2xl" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No articles yet</h3>
                    <p className="mt-1 text-gray-500">Create your first mental health article</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/blogs/create')}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Create Article
                    </motion.button>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-5 py-4 flex items-start">
                          {blog.image && (
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden mr-4">
                              <img 
                                src={blog.image_url} 
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 truncate">{blog.title}</h3>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                            <div className="mt-2 flex justify-end">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </motion.button>
                            </div>
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recently Updated</h2>
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
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <FiRefreshCw className="text-blue-400 text-2xl" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No updates yet</h3>
                    <p className="mt-1 text-gray-500">Updated articles will appear here</p>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {updatedBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-5 py-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900">{blog.title}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Updated
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            Last updated: {format(new Date(blog.updated_at), 'MMM d, yyyy h:mm a')}
                          </p>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Created: {format(new Date(blog.created_at), 'MMM d, yyyy')}
                            </span>
                            {/* <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              View Changes <FiPlus className="ml-1" />
                            </motion.button> */}
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
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                  <FiEdit className="text-lg" />
                </div>
                <h3 className="text-base font-medium">Create New Article</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Share mental health knowledge with your community.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/blogs')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                Write Article
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                  <FiCalendar className="text-lg" />
                </div>
                <h3 className="text-base font-medium">Add Wellness Event</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Organize mental health workshops or webinars.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/event-cms')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                Schedule Event
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                  <FiBarChart2 className="text-lg" />
                </div>
                <h3 className="text-base font-medium">Make Web Info</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Make knowledge with your mental health content.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/webinfo')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                See Web Info
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;