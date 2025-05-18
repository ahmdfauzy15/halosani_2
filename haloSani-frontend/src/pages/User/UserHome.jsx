import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, FiBookOpen, FiCalendar, FiUsers, 
  FiHeart, FiSun, FiMoon, FiSmile, FiMeh, FiFrown,
  FiCheckCircle, FiXCircle, FiPlus, FiMinus
} from 'react-icons/fi';
import api from '../../api/axios';
import './UserHome.css';
import CommunityChat from '../../components/User/CommunityChat';

const UserHome = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [gratitudeList, setGratitudeList] = useState([]);
  const [newGratitudeItem, setNewGratitudeItem] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Load data dari localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // State dengan inisialisasi dari localStorage
  const [currentMood, setCurrentMood] = useState(() => 
    loadFromLocalStorage('currentMood', null)
  );
  const [moodHistory, setMoodHistory] = useState(() => 
    loadFromLocalStorage('moodHistory', [])
  );
  const [breathingCount, setBreathingCount] = useState(() => 
    loadFromLocalStorage('breathingCount', 0)
  );
  const [journalEntries, setJournalEntries] = useState(() => 
    loadFromLocalStorage('journalEntries', [])
  );

  // Simpan ke localStorage setiap kali state berubah
  useEffect(() => {
    localStorage.setItem('currentMood', JSON.stringify(currentMood));
  }, [currentMood]);

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    localStorage.setItem('breathingCount', JSON.stringify(breathingCount));
  }, [breathingCount]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Fetch user data dan events dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        setEventsLoading(true);
        
        // Fetch events
        const eventsResponse = await api.get('/user/events', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (eventsResponse.data.success) {
          const eventsData = eventsResponse.data.events || [];
          const validatedEvents = eventsData
            .filter(event => event && event.id && event.title)
            .map(event => ({
              ...event,
              event_date: event.event_date || null,
              image: event.image 
                ? event.image.startsWith('http') 
                  ? event.image 
                  : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${event.image}`
                : null,
            }));
          setEvents(validatedEvents);
        }

        // Fetch user data
        const userResponse = await api.get('/user/dashboard/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = userResponse.data.user || userResponse.data;
        if (user) setUserData(user);

      } catch (error) {
        console.error('Error in fetchData:', error);
        setEvents([]);
      } finally {
        setLoading(false);
        setEventsLoading(false);
      }
    };

    fetchData();
  }, []);   

  // Breathing exercise effect
  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        if (prev === 'exhale') {
          setBreathingCount(c => c + 1);
          return 'inhale';
        }
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [breathingActive]);

  // Fungsi untuk menghitung statistik mood
  const getMoodStatistics = () => {
    const moodCounts = {
      happy: 0,
      neutral: 0,
      sad: 0,
      anxious: 0,
      angry: 0
    };

    moodHistory.forEach(entry => {
      if (moodCounts.hasOwnProperty(entry.mood)) {
        moodCounts[entry.mood]++;
      }
    });

    return moodCounts;
  };

  const handleMoodSelection = (mood) => {
    const newMoodEntry = {
      mood,
      date: new Date().toISOString()
    };

    setCurrentMood(mood);
    setMoodHistory(prev => [newMoodEntry, ...prev.slice(0, 29)]); // Simpan maksimal 30 entri
  };

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingPhase('inhale');
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
  };

  const addGratitudeItem = () => {
    if (newGratitudeItem.trim()) {
      setGratitudeList(prev => [...prev, newGratitudeItem.trim()]);
      setNewGratitudeItem('');
    }
  };

  const removeGratitudeItem = (index) => {
    setGratitudeList(prev => prev.filter((_, i) => i !== index));
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        content: journalEntry,
        date: new Date().toISOString()
      };
      setJournalEntries(prev => [newEntry, ...prev.slice(0, 49)]); // Simpan maksimal 50 entri
      setJournalEntry('');
      setShowJournalForm(false);
    }
  };

  const EventCarousel = () => {
    if (eventsLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading events...</span>
        </div>
      );
    }

    if (!Array.isArray(events)) {
      return (
        <div className="text-center py-8 text-red-500">
          Error: Events data format is invalid
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No upcoming events available. Check back later!
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 py-4 overflow-x-auto pb-6 snap-x snap-mandatory">
          {events.map((event, index) => {
            const imageUrl = event.image 
              ? event.image.startsWith('http') 
                ? event.image 
                : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${event.image}`
              : null;

            return (
              <motion.div
                key={event.id || `event-${index}`}
                className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden snap-center"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=Event+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-gray-700">
                      <FiCalendar className="text-4xl" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                    {event.title || 'Untitled Event'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {event.description || 'No description available'}
                  </p>
                  {event.event_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(event.event_date).toLocaleDateString('id-ID', {
                         timeZone: 'Asia/Jakarta',
                          weekday: 'long',    // Senin, Selasa, ...
                          year: 'numeric',    // 2025
                          month: 'long',      // Januari, Februari, ...
                          day: 'numeric',
                      })}
                    </p>
                  )}
                  {event.link && (
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Stats data dengan informasi dari localStorage
  const stats = [
    { 
      icon: <FiHeart />, 
      value: `${moodHistory.length} Mood Records`, 
      label: 'Mood Tracking', 
      color: '#ef4444',
      description: `Happy: ${getMoodStatistics().happy}, Neutral: ${getMoodStatistics().neutral}, Sad: ${getMoodStatistics().sad}`
    },
    { 
      icon: <FiActivity />, 
      value: breathingCount > 0 ? `${breathingCount} Completed cycles` : 'Not started', 
      label: 'Breathing Exercises', 
      color: '#4f46e5',
      description: breathingCount > 0 ? `${Math.round(breathingCount/7)} mins per week average` : 'Start your first session'
    },
    { 
      icon: <FiBookOpen />, 
      value: journalEntries.length, 
      label: 'Journal Entries', 
      color: '#10b981',
      description: journalEntries.length > 0 ? 
        `Last entry: ${new Date(journalEntries[0].date).toLocaleDateString()}` : 
        'Write your first entry'
    },
    { 
      icon: <FiCalendar />, 
      value: events.length, 
      label: 'Upcoming Events', 
      color: '#f59e0b',
      description: events.length > 0 ? 
        `Next event: ${events[0].title}` : 
        'No upcoming events'
    }
  ];

  const recentActivities = [
    { 
      title: currentMood ? `Logged ${currentMood} mood` : 'No mood logged today', 
      time: 'Today', 
      icon: currentMood ? '😊' : '🤔' 
    },
    { 
      title: breathingCount > 0 ? 'Completed breathing exercise' : 'No breathing exercise today', 
      time: breathingCount > 0 ? 'Today' : '--', 
      icon: breathingCount > 0 ? '🧘‍♂️' : '💨' 
    },
    { 
      title: journalEntries.length > 0 ? 'Wrote journal entry' : 'No journal entry today', 
      time: journalEntries.length > 0 ? 'Today' : '--', 
      icon: journalEntries.length > 0 ? '📝' : '✏️' 
    }
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
    }
  ];

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'bg-green-100 text-green-800' },
    { value: 'neutral', label: '😐 Neutral', color: 'bg-blue-100 text-blue-800' },
    { value: 'sad', label: '😔 Sad', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'anxious', label: '😰 Anxious', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'angry', label: '😡 Angry', color: 'bg-red-100 text-red-800' }
  ];

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
            Welcome Back, <span className="text-blue-600 dark:text-blue-400">
              {userData?.name || userData?.username || userData?.email?.split('@')[0] || 'Friend'}
            </span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            How are you feeling today?
          </p>
          
          <div className="mood-tracker flex flex-wrap justify-center gap-2 mb-8">
            {moodOptions.map((mood, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full ${mood.color} ${
                  currentMood === mood.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                } transition-all flex items-center gap-2`}
                onClick={() => handleMoodSelection(mood.value)}
              >
                <span className="text-xl">{mood.label.split(' ')[0]}</span>
                <span className="hidden sm:inline">{mood.label.split(' ')[1]}</span>
              </motion.button>
            ))}
          </div>
        </motion.header>

        <motion.section
          className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiCalendar className="mr-2" /> Upcoming Wellness Events
          </h2>
          <EventCarousel />
        </motion.section>

        {/* Stats Overview */}
        <motion.section 
          className="stats-section mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Wellness Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col"
                whileHover={{ y: -5 }}
                style={{ borderLeft: `4px solid ${stat.color}` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start mb-4">
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
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  {stat.description}
                </p>
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
            className={`tab-btn px-6 py-3 font-medium ${activeTab === 'tools' ? 
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('tools')}
          >
            Wellness Tools
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
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
                <FiSun className="mr-2" /> Wellness Tips
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
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Breathing Exercise */}
            <motion.section
              className="breathing-exercise bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FiActivity className="mr-2" /> Breathing Exercise
              </h2>
              {!breathingActive ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    This 4-4-4 breathing exercise can help reduce stress and anxiety.
                  </p>
                  <button
                    onClick={startBreathingExercise}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center gap-2 mx-auto shadow-md"
                  >
                    <FiPlus className="w-5 h-5" />
                    <span>Start Breathing Exercise</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="breathing-circle mx-auto w-48 h-48 rounded-full flex items-center justify-center mb-6 transition-all duration-1000"
                    style={{
                      backgroundColor: breathingPhase === 'inhale' ? '#dbeafe' : 
                                      breathingPhase === 'hold' ? '#bfdbfe' : '#93c5fd',
                      transform: breathingPhase === 'inhale' ? 'scale(1.1)' : 
                                breathingPhase === 'hold' ? 'scale(1)' : 'scale(0.9)'
                    }}
                  >
                    <span className="text-2xl font-bold text-gray-800">
                      {breathingPhase === 'inhale' ? 'Breathe In' : 
                       breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {breathingPhase === 'inhale' ? 'Inhale deeply for 4 seconds' : 
                     breathingPhase === 'hold' ? 'Hold your breath for 4 seconds' : 
                     'Exhale slowly for 4 seconds'}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Completed cycles: {breathingCount}
                  </p>
                  <button
                    onClick={stopBreathingExercise}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-lg hover:from-red-700 hover:to-pink-800 transition-all flex items-center gap-2 mx-auto shadow-md"
                  >
                    <FiXCircle className="w-5 h-5" />
                    <span>Stop Exercise</span>
                  </button>
                </div>
              )}
            </motion.section>

            {/* Gratitude Journal */}
            <motion.section
              className="gratitude-journal bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FiHeart className="mr-2" /> Gratitude Journal
              </h2>
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGratitudeItem}
                    onChange={(e) => setNewGratitudeItem(e.target.value)}
                    placeholder="What are you grateful for today?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                  <button
                    onClick={addGratitudeItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {gratitudeList.length > 0 ? (
                  gratitudeList.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-gray-800 dark:text-white">• {item}</span>
                      <button
                        onClick={() => removeGratitudeItem(index)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Add things you're grateful for to get started</p>
                )}
              </div>
            </motion.section>

            {/* Personal Journal */}
            <motion.section
              className="personal-journal bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <FiBookOpen className="mr-2" /> Personal Journal
                </h2>
                <button
                  onClick={() => setShowJournalForm(!showJournalForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {showJournalForm ? (
                    <>
                      <FiXCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-4 h-4" />
                      <span>New Entry</span>
                    </>
                  )}
                </button>
              </div>

              {showJournalForm && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Write your thoughts here..."
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={saveJournalEntry}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Save Entry</span>
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {journalEntries.length > 0 ? (
                  journalEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('id-ID', {
                          timeZone: 'Asia/Jakarta',
                          weekday: 'long',    // Senin, Selasa, ...
                          year: 'numeric',    // 2025
                          month: 'long',      // Januari, Februari, ...
                          day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-white whitespace-pre-line">
                        {entry.content}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {showJournalForm ? 'Write your first journal entry' : 'No journal entries yet'}
                  </p>
                )}
              </div>
            </motion.section>
          </div>
        )}
      </div>
      <CommunityChat />
    </div>
  );
};

export default UserHome;