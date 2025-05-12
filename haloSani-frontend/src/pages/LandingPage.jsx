import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMenu, FiX } from 'react-icons/fi';
import './LandingPage.css';
import halosanilan from '../assets/halosani_lan.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const navItems = [
    { 
      label: 'Features', 
      action: () => document.getElementById('features').scrollIntoView({ behavior: 'smooth' }) 
    },
    { 
      label: 'Stories', 
      action: () => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' }) 
    },
    { 
      label: 'Login', 
      action: () => navigate('/user/login') 
    }
  ];

  return (
    <div className="halosani-landing">
      {/* Gradient Background */}
      <div className="gradient-bg"></div>
      
      {/* Floating Particles */}
        <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

       {/* Mobile Navigation */}
      <nav className="mobile-navbar">
        <motion.div 
          className="navbar-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="halo">Halo</span>
          <span className="sani">sani</span>
        </motion.div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="menu-items">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                className="menu-item"
                onClick={() => {
                  item.action();
                  setIsMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
        <nav className="landing-nav">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="halo">Halo</span>
          <span className="sani">sani</span>
        </motion.div>
        <div className="nav-links">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="nav-link"
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            Features
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="nav-link"
            onClick={() => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' })}
          >
            Stories
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="nav-link"
            onClick={() => navigate('/user/login')}
          >
            Login
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <h1 className="hero-tagline">
              <span className="gradient-text">Mental Wellness</span> 
              <br />
              Starts Here
            </h1>
            <p className="hero-description">
              Di dunia yang serba cepat saat ini, kesehatan mental telah menjadi aspek penting dari kesejahteraan keseluruhan. HaloSani memahami tantangan yang dihadapi individu dalam mengelola kesehatan mental, dan kami hadir untuk menyediakan lingkungan yang suportif dan mudah diakses. Baik Anda berurusan dengan stres, kecemasan, depresi, atau masalah kesehatan mental lainnya,HaloSani adalah teman terpercaya untuk temani anda dalam edukasi kesehatan mental dan dalam perjalanan menuju kesehatan mental yang lebih baik.
            </p>
            <div className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="primary-btn"
                onClick={() => navigate('/user/login')}
              >
                Begin Your Journey
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-btn"
              >
                How It Works
              </motion.button> */}
            </div>
          </motion.div>
          <motion.div 
            className="hero-image-container"
            variants={itemVariants}
          >
            <div className="phone-mockup">
              <img 
                src={halosanilan}
                alt="Halosani app interface" 
                className="mockup-screen"
              />
            </div>
            <div className="floating-elements">
              <motion.div 
                className="floating-element element-1"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧘‍♀️
              </motion.div>
              <motion.div 
                className="floating-element element-2"
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                😌
              </motion.div>
              <motion.div 
                className="floating-element element-3"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                🌱
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeIn}
      >
        <div className="stats-container">
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Terbuka Untuk Umum</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Menenmani Anda</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Support Available</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2>Teman Edukasi Kesehatan Mental Anda</h2>
          <p>Fitur-fitur komprehensif yang dirancang untuk mendukung perjalanan kesehatan Anda</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2>Real Stories, Real Healing</h2>
          <p>Dengarkan cerita dari orang-orang yang telah mengubah kesehatan mental mereka dengan HaloSani</p>
        </motion.div>

        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-content">
                <p>"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <motion.section 
        className="final-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="cta-container">
          <h2>Siap memprioritaskan kesehatan mental Anda?</h2>
          <p>Bergabunglah dengan kami dan orang yang telah menemukan keseimbangan dengan HaloSani</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-btn"
            onClick={() => navigate('/user/login')}
          >
            Get Started for Free
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="halo">Halo</span>
            <span className="sani">sani</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="/admin/login">Admin</a>

          </div>
          <div className="footer-social">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Halosani. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Data for features
const features = [
  {
    icon: '🧠',
    title: 'Mentor AI',
    description: 'Menggunakan teknologi Large Language Model (LLM) dan RAG untuk memberikan dukungan, wawasan, dan saran terkait kesehatan mental.'
  },
  {
    icon: '📘',
    title: 'Blog Kesehatan Mental',
    description: 'Fitur Blog dalam aplikasi HaloSani dirancang untuk memberikan akses kepada pengguna ke berbagai informasi berkualitas yang relevan dengan kesehatan mental.'
  },
  {
    icon: '🎥',
    title: 'Video Kesehatan Mental',
    description: 'Kumpulan sesi untuk video terkait kesehatan mental, tidur, kecemasan, dan lainnya'
  },
  {
    icon: '👥',
    title: 'Chat Community',
    description: 'Chat Community dalam aplikasi HaloSani dirancang untuk menciptakan ruang interaksi yang inklusif dan mendukung'
  },
  {
    icon: '📝',
    title: 'E-book',
    description: 'Fitur ini memungkinkan pengguna untuk memperluas wawasan mereka, mendukung penelitian, dan meningkatkan pemahaman mereka tentang berbagai topik kesehatan mental.'
  },
  {
    icon: '🎯',
    title: 'Event',
    description: 'Fitur Event dalam aplikasi HaloSani dirancang untuk mempermudah pengguna mengetahui dan mengikuti berbagai acara yang berkaitan dengan kesehatan mental.'
  }
];

// Data for testimonials
const testimonials = [
  {
    quote: "Halosani membantu saya mengelola kecemasan saya dengan cara yang tidak pernah saya duga sebelumnya. Sesi yang dipandu sangat mengubah hidup saya.",
    avatar: "👩",
    name: "Harmoni",
    role: "Student, 22"
  },
  {
    quote: "Halosani adalah satu-satunya aplikasi yang benar-benar membantu saya mengembangkan strategi penanganan jangka panjang.",
    avatar: "👨",
    name: "Ahmad",
    role: "Student, 21"
  },
  {
    quote: "Dukungan komunitas membuat saya merasa tidak sendirian. Saya telah mendapatkan teman sejati melalui perjalanan ini.",
    avatar: "🧑",
    name: "Gagah.",
    role: "Student, 21"
  }
];

export default LandingPage;