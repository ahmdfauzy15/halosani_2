import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './LandingPage.css';
import halosanilan from '../assets/halosani_lan.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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
              Halosani combines evidence-based therapy techniques with personalized 
              support to help you build resilience and emotional balance.
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-btn"
              >
                How It Works
              </motion.button>
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
            <h3 className="stat-number">10k+</h3>
            <p className="stat-label">Active Users</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <h3 className="stat-number">98%</h3>
            <p className="stat-label">Report Reduced Anxiety</p>
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
          <h2>Your Mental Health Toolkit</h2>
          <p>Comprehensive features designed to support your wellness journey</p>
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
          <p>Hear from people who transformed their mental health with Halosani</p>
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
          <h2>Ready to prioritize your mental health?</h2>
          <p>Join thousands who have found balance with Halosani</p>
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
            <a href="#">About</a>
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
    title: 'Personalized Therapy',
    description: 'AI-powered recommendations based on your unique needs and progress'
  },
  {
    icon: '📊',
    title: 'Mood Tracking',
    description: 'Visualize your emotional patterns and identify triggers'
  },
  {
    icon: '🎧',
    title: 'Guided Meditations',
    description: '100+ sessions for stress, sleep, anxiety and more'
  },
  {
    icon: '👥',
    title: 'Community Support',
    description: 'Connect with others in safe, moderated groups'
  },
  {
    icon: '📝',
    title: 'Journal Prompts',
    description: 'Structured writing exercises for self-reflection'
  },
  {
    icon: '🎯',
    title: 'Goal Setting',
    description: 'Build healthy habits with achievable milestones'
  }
];

// Data for testimonials
const testimonials = [
  {
    quote: "Halosani helped me manage my anxiety in ways I never thought possible. The guided sessions are life-changing.",
    avatar: "👩",
    name: "Sarah K.",
    role: "Teacher, 32"
  },
  {
    quote: "After trying many apps, Halosani is the only one that actually helped me develop long-term coping strategies.",
    avatar: "👨",
    name: "Michael T.",
    role: "Software Engineer, 28"
  },
  {
    quote: "The community support makes me feel less alone. I've made real friends through this journey.",
    avatar: "🧑",
    name: "Alex J.",
    role: "Student, 21"
  }
];

export default LandingPage;