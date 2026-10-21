import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
          setError('Please enter a valid 10-digit Indian phone number');
          setIsLoading(false);
          return;
        }
        success = await register(formData.name, formData.email, formData.phone, formData.password);
      }

      if (success) {
        if (formData.email.trim().toLowerCase() === 'admin@slshweaves.com') {
          navigate('/admin', { replace: true });
        } else {
          navigate(redirectTo, { replace: true });
        }
      } else {
        setError(mode === 'login' ? 'Invalid email or password' : 'Email already registered');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1 mb-8 group">
            <div className="w-12 h-12 bg-[#721224] rounded-xs flex items-center justify-center border border-[#c5a059]/40 shadow-sm">
              <span className="font-serif text-[#f5eedf] font-bold text-lg">SL</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#721224] uppercase mt-2">
              SRI LAKSHMI SAREE HOUSE
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#c5a059] uppercase font-semibold">
              SLSH WEAVES · ESTABLISHED 2003
            </span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-wide">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-stone-600 text-xs">
            {mode === 'login' 
              ? "Don't have an account? " 
              : 'Already have an account? '}
            <button
              onClick={switchMode}
              className="text-[#721224] font-semibold hover:underline ml-1"
            >
              {mode === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>

        <Card className="p-8 border-stone-200 rounded-xs shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-red-700 text-xs" role="alert">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Radhika Sharma"
                  autoComplete="name"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  autoComplete="tel"
                />
              </>
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            <Button type="submit" className="w-full bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-wider py-3.5 rounded-xs font-semibold shadow-md mt-2" isLoading={isLoading} size="lg">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create SLSH Account'}
            </Button>

            {mode === 'login' && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Demo Admin: <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">admin@slshweaves.com</code></span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, email: 'admin@slshweaves.com', password: 'admin123' })}
                  className="text-[#721224] font-semibold hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
