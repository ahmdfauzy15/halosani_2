// src/components/Admin/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout, isMobile = false }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Blogs',
      path: '/admin/blogs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Events',
      path: '/admin/event-cms',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Ebook',
      path: '/admin/ebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },

    {
      name: 'Web Info',
      path: '/admin/webinfo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zM2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
        </svg>
      )
    }
    
  ];

  return (
    <div className={`
      ${isMobile ? 'block' : 'hidden md:flex'} 
      w-72 bg-gradient-to-b from-indigo-900 to-purple-900 text-white 
      flex-col p-6 shadow-2xl h-full md:h-screen fixed z-50 transition-all duration-300
    `}>
      {/* Logo/Brand */}
      <div className="flex items-center mb-10 pl-2 group">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-3 transition-all duration-500 group-hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
          Admin Panel
        </h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center p-4 rounded-xl transition-all duration-300
              ${isActive ? 
                'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-400 shadow-md' : 
                'hover:bg-white/5 hover:border-l-4 hover:border-white/20'}
              ${hoveredItem === item.path ? 'transform hover:translate-x-2' : ''}
            `}
            onMouseEnter={() => setHoveredItem(item.path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className={`mr-4 ${location.pathname === item.path ? 'text-cyan-300' : 'text-white/70'} transition-colors duration-300`}>
              {item.icon}
            </span>
            <span className={`text-lg font-medium ${location.pathname === item.path ? 'text-white' : 'text-white/80'} transition-colors duration-300`}>
              {item.name}
            </span>
            {location.pathname === item.path && (
              <span className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
