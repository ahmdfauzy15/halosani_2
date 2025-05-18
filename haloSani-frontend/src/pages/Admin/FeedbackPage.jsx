import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { FiStar, FiTrash2, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRatings: {},
    totalFeedbacks: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Define items per page for manual pagination
  const navigate = useNavigate();

  useEffect(() => {
  const fetchFeedbacks = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await api.get(`/admin/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.feedbacks) {
        setFeedbacks(response.data.feedbacks);
        setStats({
          averageRatings: response.data.averageRatings || {},
          totalFeedbacks: response.data.totalFeedbacks || 0,
        });

        setTotalPages(Math.ceil((response.data.totalFeedbacks || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchFeedbacks();
}, []);

  // Filter feedbacks based on search term
  const filteredFeedbacks = searchTerm
    ? feedbacks.filter(feedback => 
        feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.additional_feedback?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : feedbacks;

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Update total pages when search filters change
  useEffect(() => {
    if (filteredFeedbacks && filteredFeedbacks.length >= 0) {
      setTotalPages(Math.ceil(filteredFeedbacks.length / itemsPerPage));
      
      // If current page is now out of bounds, reset to page 1
      if (currentPage > Math.ceil(filteredFeedbacks.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }
  }, [filteredFeedbacks, itemsPerPage]);

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await api.delete(`/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      });
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
      setStats(prev => ({
        ...prev,
        totalFeedbacks: prev.totalFeedbacks - 1
      }));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderRatingStars = (rating) => {
  const numericRating = Number(rating);
  if (isNaN(numericRating)) return <span className="text-gray-400 italic">No rating</span>;
  
  return (
    <Rating
      value={numericRating}
      readOnly
      style={{ maxWidth: 100 }}
      itemStyles={{
        activeFillColor: '#f59e0b',
        inactiveFillColor: '#d1d5db',
      }}
    />
  );
};


  const renderCategoryName = (category) => {
    const names = {
      login_register: 'Login/Register',
      event_info: 'Event Information',
      breath_management: 'Breath Management',
      journal_comfort: 'Journal Comfort',
      mentor_ai: 'Mentor AI',
      blog_content: 'Blog Content',
      youtube_videos: 'YouTube Videos',
      ebook_access: 'Ebook Access',
      feedback_feature: 'Feedback Feature',
      overall: 'Overall Experience'
    };
    return names[category] || category;
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={handleLogout} activeItem="feedbacks" />
      
      {/* Mobile Sidebar Toggle */}
      {/* <MobileSidebarToggle onLogout={handleLogout} /> */}
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Feedback</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    View and manage user feedback submissions
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <FiMessageSquare />
                  {stats.totalFeedbacks} {stats.totalFeedbacks === 1 ? 'Feedback' : 'Feedbacks'}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(stats.averageRatings || {}).map(([category, rating]) => (
                  <div key={category} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {renderCategoryName(category)}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-2xl font-semibold text-gray-900">
                        {typeof rating === 'number' ? rating.toFixed(1) : 'N/A'}
                      </div>
                      {renderRatingStars(rating)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback List */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : currentFeedbacks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No feedback found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'No feedback submissions yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentFeedbacks.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                {feedback.user ? (
                                  <span className="font-medium">
                                    {feedback.user.name ? feedback.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'}
                                  </span>
                                ) : (
                                  <FiUser className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {feedback.name || (feedback.user ? feedback.user.name : 'Anonymous')}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                  {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(feedback)
                                .filter(([key]) => key.endsWith('_rating') && key !== 'overall_rating')
                                .map(([key, rating]) => (
                                  <div key={key} className="border border-gray-200 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-gray-700">
                                      {renderCategoryName(key.replace('_rating', ''))}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-2">
                                      {renderRatingStars(rating)}
                                      <span className="text-sm text-gray-500">{rating}/5</span>
                                    </div>
                                    {feedback[key.replace('_rating', '_reason')] && (
                                      <p className="mt-2 text-sm text-gray-600">
                                        {feedback[key.replace('_rating', '_reason')]}
                                      </p>
                                    )}
                                  </div>
                                ))}
                            </div>

                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Experience</h4>
                              <div className="flex items-center gap-4">
                                {renderRatingStars(feedback.overall_rating)}
                                <span className="text-sm text-gray-500">{feedback.overall_rating}/5</span>
                              </div>
                              {feedback.overall_reason && (
                                <p className="mt-2 text-sm text-gray-600">
                                  {feedback.overall_reason}
                                </p>
                              )}
                            </div>

                            {feedback.additional_feedback && (
                              <div className="mt-4 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Feedback</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                  {feedback.additional_feedback}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-shrink-0 justify-end">
                            <button
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                            >
                              <FiTrash2 className="mr-1.5 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 px-6 py-4">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{Math.min(filteredFeedbacks.length, indexOfFirstItem + 1)}</span> to{' '}
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredFeedbacks.length)}</span> of{' '}
                        <span className="font-medium">{filteredFeedbacks.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;