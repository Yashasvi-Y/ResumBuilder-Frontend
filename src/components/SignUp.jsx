import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './Inputs';
import { validateEmail } from '../utils/helper';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../context/userContext';
import toast from 'react-hot-toast';
import { authStyles as styles } from '../assets/dummystyle';

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('details'); // 'details' or 'verify'
  const [userId, setUserId] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError('Please enter full name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address (e.g., user@gmail.com)');
      return;
    }
    if (!password) {
      setError('Please enter the password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, {
        name: fullName,
        email,
        password,
      });
      setUserId(response.data.userId);
      setStep('verify');
      toast.success('OTP sent to your email! Check your inbox.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        userId,
        otp,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        toast.success('Email verified! Welcome!');
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>

      {step === 'details' ? (
        <form onSubmit={handleSendOTP} className={styles.signupForm}>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            disabled={loading}
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="email@example.com"
            type="email"
            disabled={loading}
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
            disabled={loading}
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" className={styles.signupSubmit} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
          <p className={styles.switchText}>
            Already have an account?{' '}
            <button type="button" className={styles.signupSwitchButton} onClick={() => setCurrentPage('login')}>
              Sign In
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className={styles.signupForm}>
          <p className="text-center text-gray-600 mb-4">
            We sent an OTP to <strong>{email}</strong>
          </p>
          <Input
            value={otp}
            onChange={({ target }) => setOtp(target.value)}
            label="Enter OTP"
            placeholder="000000"
            type="text"
            maxLength="6"
            disabled={loading}
          />
          <p className="text-center text-sm text-gray-600 mt-2">
            OTP expires in 5 minutes
          </p>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" className={styles.signupSubmit} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            className={styles.signupSwitchButton}
            onClick={() => setStep('details')}
            disabled={loading}
          >
            Back to Details
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;