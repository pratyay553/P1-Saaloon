"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../../../components/forms/InputField';
import Button from '../../../components/common/Button';
import { signup } from '../../../services/authService';
import styles from './signup.module.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up for SAloon</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <InputField
          label="Username"
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <InputField
          label="Email"
          type="email"
          id="email"
          value={formData.email}
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
        <InputField
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
