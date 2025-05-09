import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaBrain, FaLeaf } from 'react-icons/fa';
import { GiMeditation, GiHealthNormal } from 'react-icons/gi';

const WebInfoPage = () => {
  const [webInfo, setWebInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAnimation, setActiveAnimation] = useState(0);

  // Mental health animations
  const animations = [
    { icon: <FaHeart className="text-pink-500 text-4xl" />, text: "Self-Care Matters" },
    { icon: <GiMeditation className="text-purple-500 text-4xl" />, text: "Mindfulness Practice" },
    { icon: <FaBrain className="text-blue-500 text-4xl" />, text: "Mental Wellness" },
    { icon: <GiHealthNormal className="text-green-500 text-4xl" />, text: "Holistic Health" },
    { icon: <FaLeaf className="text-emerald-500 text-4xl" />, text: "Growth & Healing" }
  ];

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const response = await api.get('/user/web-info');
        if (response.data.length > 0) {
          const info = response.data[0];
          if (info.image) {
            info.imageUrl = `http://localhost:8000/storage/${info.image}`;
          }
          setWebInfo(info);
        }
      } catch (err) {
        console.error('Error fetching web info:', err);
        setError('Failed to load website information');
      } finally {
        setLoading(false);
      }
    };

    fetchWebInfo();

    // Rotate animations every 5 seconds
    const interval = setInterval(() => {
      setActiveAnimation((prev) => (prev + 1) % animations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Function to render HTML with proper line breaks
  const renderHTML = (htmlString) => {
    return { 
      __html: htmlString?.replace(/\n/g, '<br>') || '' 
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-4 text-center"
        >
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!webInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-4 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No website information available</h2>
          <p className="text-gray-600 mb-4">Please check back later</p>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-4xl text-blue-500"
          >
            <GiHealthNormal />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Floating Mental Health Animation */}
      <div className="fixed bottom-8 right-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAnimation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-full shadow-xl flex flex-col items-center justify-center w-16 h-16"
          >
            {animations[activeAnimation].icon}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 text-xs font-medium text-gray-700 whitespace-nowrap"
            >
              {animations[activeAnimation].text}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-28 overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -ml-32 -mt-32"
        />
        <motion.div 
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -15, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 opacity-10 rounded-full -mr-40 -mb-40"
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-blue-200">{webInfo.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
          >
            Your journey to mental wellness starts here
          </motion.p>
          
          {/* Animated mental health icons */}
          <div className="flex justify-center mt-8 space-x-6">
            {[FaHeart, GiMeditation, FaBrain, GiHealthNormal, FaLeaf].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ y: 0 }}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.2
                }}
                className="text-3xl text-white opacity-80"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Content */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {webInfo.imageUrl && (
                <div className="lg:order-last relative overflow-hidden">
                  <motion.img 
                    src={webInfo.imageUrl} 
                    alt={webInfo.title}
                    className="w-full h-full object-cover min-h-96"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x500?text=About+Us';
                      e.target.onerror = null;
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
                  />
                </div>
              )}
              
              <div className="p-8 md:p-12">
                <motion.h2 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                >
                  Our <span className="text-blue-600">Mission</span>
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="prose max-w-none text-gray-600 whitespace-pre-line"
                  dangerouslySetInnerHTML={renderHTML(webInfo.description)}
                />
                
                {/* Mental health stats animation */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {[
                    { value: "100%", label: "Compassion" },
                    { value: "24/7", label: "Support" },
                    { value: "365", label: "Days/Year" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-blue-50 p-4 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              We're Here <span className="text-blue-600">For You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reach out anytime - your mental health is our priority
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <FiMail className="text-blue-600 text-2xl" />,
                title: "Email",
                content: webInfo.contact || 'contact@example.com',
                color: "bg-blue-100"
              },
              {
                icon: <FiPhone className="text-green-600 text-2xl" />,
                title: "Phone",
                content: webInfo.contact || '+1 (123) 456-7890',
                color: "bg-green-100"
              },
              {
                icon: <FiMapPin className="text-purple-600 text-2xl" />,
                title: "Address",
                content: webInfo.address || '123 Main Street\nCity, Country',
                color: "bg-purple-100"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`${item.color} rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all`}
              >
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Social Media */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
          >
            Join Our <span className="text-blue-600">Community</span>
          </motion.h2>
          
          <motion.div 
            className="flex justify-center space-x-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {[
              { icon: <FaFacebook className="text-blue-600 text-2xl" />, color: "hover:bg-blue-100" },
              { icon: <FaTwitter className="text-blue-400 text-2xl" />, color: "hover:bg-blue-100" },
              { icon: <FaInstagram className="text-pink-600 text-2xl" />, color: "hover:bg-pink-100" },
              { icon: <FaLinkedin className="text-blue-700 text-2xl" />, color: "hover:bg-blue-100" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 bg-white rounded-full shadow-lg ${social.color} transition-all`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Mental health affirmation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md"
          >
            <motion.p
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-lg md:text-xl text-gray-700 italic"
            >
              "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating back to top button */}
      {/* <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button> */}
    </div>
  );
};

export default WebInfoPage;