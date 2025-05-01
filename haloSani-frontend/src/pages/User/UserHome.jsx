import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiBookOpen, FiCalendar, FiUsers, FiHeart, FiSun, FiMoon } from 'react-icons/fi';
import './UserHome.css';

const UserHome = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);

  const stats = [
    { icon: <FiHeart />, value: '7 days', label: 'Current Streak', color: '#ef4444' },
    { icon: <FiActivity />, value: '12 hours', label: 'Meditation', color: '#4f46e5' },
    { icon: <FiBookOpen />, value: '24', label: 'Journal Entries', color: '#10b981' },
    { icon: <FiUsers />, value: '5', label: 'Support Groups', color: '#f59e0b' }
  ];

  const recentActivities = [
    { title: 'Completed Morning Meditation', time: '2 hours ago', icon: '🧘‍♂️' },
    { title: 'Logged Journal Entry', time: 'Yesterday', icon: '📝' },
    { title: 'Joined Anxiety Support Group', time: '2 days ago', icon: '👥' }
  ];

  const wellnessTips = [
    { 
      tip: 'Practice deep breathing for 5 minutes today',
      benefit: 'Reduces stress and anxiety by activating the parasympathetic nervous system'
    },
    { 
      tip: 'Write down three things you are grateful for',
      benefit: 'Boosts mood and shifts focus to positive aspects of life'
    },
    { 
      tip: 'Take a 10-minute walk outside',
      benefit: 'Increases serotonin levels and improves overall mental wellbeing'
    },
    { 
      tip: 'Connect with a friend or family member',
      benefit: 'Strengthens social connections which are vital for mental health'
    }
  ];

  const moodOptions = ['😊 Happy', '😐 Neutral', '😔 Sad', '😰 Anxious', '😡 Angry'];

  return (
    <div className={`user-home ${darkMode ? 'dark' : ''}`}>
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header with Mood Tracker */}
        <motion.header 
          className="welcome-header mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome Back, <span className="text-blue-600 dark:text-blue-400">User</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            How are you feeling today?
          </p>
          
          <div className="mood-tracker flex justify-center space-x-2 mb-8">
            {moodOptions.map((mood, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                {mood}
              </motion.button>
            ))}
          </div>
        </motion.header>

        {/* Stats Overview */}
        <motion.section 
          className="stats-section mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-start"
                whileHover={{ y: -5 }}
                style={{ borderLeft: `4px solid ${stat.color}` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="stat-icon text-2xl p-3 rounded-lg mr-4"
                  style={{ 
                    color: stat.color,
                    backgroundColor: `${stat.color}20`
                  }}
                >
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Content Tabs */}
        <div className="content-tabs flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button 
            className={`tab-btn px-6 py-3 font-medium ${activeTab === 'overview' ? 
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn px-6 py-3 font-medium ${activeTab === 'resources' ? 
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('resources')}
          >
            Mental Health Resources
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.section 
            className="recent-activity lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiCalendar className="mr-2" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={index}
                  className="activity-item flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="activity-icon text-2xl mr-4">{activity.icon}</div>
                  <div className="activity-details">
                    <h4 className="font-medium text-gray-800 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Wellness Tips */}
          <motion.section 
            className="wellness-tips bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiSun className="mr-2" /> Today's Wellness Tips
            </h2>
            <div className="space-y-4">
              {wellnessTips.map((item, index) => (
                <motion.div 
                  key={index}
                  className="tip-card p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-start">
                    <div className="tip-number w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mr-3 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{item.tip}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.benefit}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Mental Health Articles (shown in resources tab) */}
          {activeTab === 'resources' && (
            <motion.section 
              className="resources-section lg:col-span-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mental Health Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentalHealthArticles.map((article, index) => (
                  <motion.div
                    key={index}
                    className="article-card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{article.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{article.summary}</p>
                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Read More
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;