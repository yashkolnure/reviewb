import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Basic validation before hitting the server
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) tempErrors.email = "Please enter a valid email address";
    if (!formData.password) tempErrors.password = "Password is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5006/api/auth/login', formData);
      
      // Store the token and user data
      localStorage.setItem('token', res.data.token);
      
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      // Handle "Invalid Credentials" or Server errors
      setErrors({ server: err.response?.data?.message || "Login failed. Please check your credentials." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md bg-[#111214] p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Access your AI reputation dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Address */}
          <InputField 
            label="Email Address" 
            type="email" 
            placeholder="john@avenirya.com" 
            error={errors.email}
            onChange={(v) => setFormData({...formData, email: v})} 
          />
          
          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-purple-400 hover:underline">Forgot?</Link>
            </div>
            <input 
              type="password"
              placeholder="••••••••"
              className={`w-full bg-[#08090a] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} p-3 rounded-xl text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-700`}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Server Error Message */}
          {errors.server && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center font-medium">
              {errors.server}
            </div>
          )}

          <button 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
            ${isSubmitting ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 hover:scale-[1.01]'}`}
          >
            {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          New to ReviewBot? <Link to="/register" className="text-purple-400 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

// Reusable Input Component to keep code DRY
const InputField = ({ label, type, placeholder, onChange, error }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      className={`w-full bg-[#08090a] border ${error ? 'border-red-500/50' : 'border-white/10'} p-3 rounded-xl text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-700`}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Login;