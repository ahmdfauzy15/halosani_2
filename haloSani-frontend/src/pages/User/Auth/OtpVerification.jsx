import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user ID and email from navigation state
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      toast.error('Session expired. Please register again.');
      navigate('/user/register');
      return;
    }

    // Start countdown for resend OTP
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate, userId, email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/verify-otp', {
        user_id: userId,
        otp: otp
      });

      toast.success(response.data.message);
      
      // Save token and user data
      localStorage.setItem('user_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      navigate('/user/dashboard');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'OTP verification failed';
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Jika error karena OTP expired, tampilkan tombol resend
      if (error.response?.data?.message?.includes('expired')) {
        setCountdown(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/resend-otp', {
        user_id: userId
      });
      
      toast.success(response.data.message);
      setCountdown(60); // Reset countdown
      
      // Tampilkan waktu kedaluwarsa OTP baru jika ada
      if (response.data.expires_at) {
        toast.info(`New OTP will expire at ${new Date(response.data.expires_at).toLocaleTimeString()}`);
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to resend OTP';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8 text-center">
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-indigo-100 mt-1">We've sent a code to {email}</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setError(null);
                }}
                className="w-full px-4 py-3 text-center text-xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={6}
                inputMode="numeric"
                pattern="\d{6}"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={countdown > 0 || resendLoading}
                className={`text-indigo-600 font-medium ${countdown > 0 || resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo-800'}`}
              >
                {resendLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : `Resend OTP ${countdown > 0 ? `(${countdown}s)` : ''}`}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;