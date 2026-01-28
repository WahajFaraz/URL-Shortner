import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Button, Input } from '../common/UIComponents.jsx';
import { slideUp } from '../../utils/animations.js';
import toast from 'react-hot-toast';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await loginUser(formData.email, formData.password);
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit();
  };

  return (
    <motion.form onSubmit={handleFormSubmit} className="space-y-4" {...slideUp}>
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button 
        type="submit" 
        variant="primary" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </motion.form>
  );
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerUser, isLoading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await registerUser(formData.name, formData.email, formData.password);
    if (success) {
      toast.success('Account created successfully! Please login to continue.');
      navigate('/login');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit();
  };

  return (
    <motion.form onSubmit={handleFormSubmit} className="space-y-4" {...slideUp}>
      <Input
        name="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters long</p>
      <Input
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </motion.form>
  );
};
