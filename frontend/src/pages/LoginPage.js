import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/account';
    toast.success('Redirecting to Google login...');
    // In production: window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    
    // For now, simulate successful login
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        name: 'Demo User',
        email: 'demo@afrolatino.ca'
      }));
      toast.success('Login successful!');
      navigate('/account');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      if (response.user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="https://customer-assets.emergentagent.com/job_culticommerce/artifacts/x3503la8_afro-latino%20logo.png" 
              alt="Afro-Latino Marketplace" 
              className="h-16 mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isAdminLogin ? 'Access the administration panel' : 'Sign in to your account'}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Google Login (only for regular users) */}
            {!isAdminLogin && (
              <>
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  size="lg"
                  className="w-full mb-6"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isAdminLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-amber-600 hover:text-amber-700">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className={`w-full ${isAdminLogin ? 'bg-gray-900 hover:bg-gray-800' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    {isAdminLogin ? 'Sign In as Admin' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            {!isAdminLogin && (
              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold">
                  Sign up
                </Link>
              </p>
            )}

            {isAdminLogin && (
              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-gray-600 hover:text-amber-600 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Website
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
