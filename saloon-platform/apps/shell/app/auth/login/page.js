"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../../../components/forms/InputField';
import Button from '../../../components/common/Button';
import { login } from '../../../services/authService'; // Will create this function
import styles from './login.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await login(formData.usernameOrEmail, formData.password);
      setSuccess('Login successful! Redirecting to dashboard...');
      // In a real app, you'd store the token (e.g., in localStorage) and redirect
      console.log('Login successful:', response);
      setTimeout(() => router.push('/dashboard'), 2000); // Redirect to a dashboard or home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login to SAloon</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <InputField
          label="Username or Email"
          type="text"
          id="usernameOrEmail"
          value={formData.usernameOrEmail}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      <p className={styles.signupPrompt}>
        Don't have an account? <a href="/auth/signup">Sign Up</a>
      </p>
    </div>
  );
}
