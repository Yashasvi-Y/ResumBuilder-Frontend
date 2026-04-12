import React, { useState } from 'react';
import { Input } from './Inputs';
import { validateEmail } from '../utils/helper';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { authStyles as styles } from '../assets/dummystyle';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email', 'verify', 'reset'

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setStep('verify');
      toast.success('OTP sent to your email!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP.');
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
    if (!newPassword) {
      setError('Please enter new password');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email,
        otp,
        newPassword,
      });
      toast.success('Password reset successfully!');
      onBack(); // Go back to login
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Reset Password</h3>
        <p className={styles.signupSubtitle}>We'll help you get back into your account</p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleSendOTP} className={styles.signupForm}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="your-email@example.com"
            type="email"
            disabled={loading}
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" className={styles.signupSubmit} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <button
            type="button"
            className={styles.signupSwitchButton}
            onClick={onBack}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyOTP} className={styles.signupForm}>
          <p className="text-center text-gray-600 mb-4">
            Check your email <strong>{email}</strong> for the OTP
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
          <Input
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
            label="New Password"
            placeholder="Min 8 characters"
            type="password"
            disabled={loading}
          />
          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Re-enter password"
            type="password"
            disabled={loading}
          />
          <p className="text-center text-sm text-gray-600 mt-2">
            OTP expires in 5 minutes
          </p>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" className={styles.signupSubmit} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            type="button"
            className={styles.signupSwitchButton}
            onClick={() => {
              setStep('email');
              setOtp('');
              setNewPassword('');
              setConfirmPassword('');
              setError(null);
            }}
            disabled={loading}
          >
            Back to Email
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
