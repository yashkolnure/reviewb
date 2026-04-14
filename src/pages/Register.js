import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import default library styles

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation Logic to add production-level reliability
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (formData.fullName.trim().length < 3) tempErrors.fullName = "Full name must be at least 3 characters";
    if (!emailRegex.test(formData.email)) tempErrors.email = "Please enter a valid email address";
    // Phone length check depends on country, but ensuring it's not empty is a good start. 
    // The library helps with format, but we check if it's there.
    if (!formData.phone || formData.phone.length < 5) tempErrors.phone = "Please enter a valid phone number";
    if (formData.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if client-side validation fails

    setIsSubmitting(true);
    try {
      // Direct call as requested, to your backend route
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Please login.");
      navigate('/login'); // Redirect to login page on success
    } catch (err) {
      // Catch and display server-side errors (e.g., 'User already exists')
      setErrors({ server: err.response?.data?.message || "Connection failed. Try again." });
    } finally {
      setIsSubmitting(false); // Enable the button again
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md bg-[#111214] p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ReviewBot.ai's Cyber-Neural Platform</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <InputField 
            label="Full Name" 
            type="text" 
            placeholder="John Doe" 
            error={errors.fullName}
            onChange={(v) => setFormData({...formData, fullName: v})} 
          />
          
          {/* Email */}
          <InputField 
            label="Email Address" 
            type="email" 
            placeholder="john@example.com" 
            error={errors.email}
            onChange={(v) => setFormData({...formData, email: v})} 
          />
          
          {/* Phone with Country Select and integrated color correction */}
          <div className="react-phone-input-container">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Phone Number</label>
            <PhoneInput
              country={'in'} // Set default country to India
              value={formData.phone}
              onChange={(phone) => setFormData({...formData, phone})}
              enableSearch={true} // Add ability to search countries
              // Custom classes for overall layout
              containerClass="phone-container w-full"
              inputClass="phone-input-field"
              buttonClass="phone-dropdown-btn"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          {/* Password */}
          <InputField 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            error={errors.password}
            onChange={(v) => setFormData({...formData, password: v})} 
          />

          {/* Display Server Side Errors */}
          {errors.server && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center font-medium">
              {errors.server}
            </div>
          )}

          <button 
            disabled={isSubmitting} // Disable during submission to prevent double clicks
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
            ${isSubmitting ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 hover:scale-[1.01]'}`}
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-purple-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>

      {/* !!! CRITICAL: Color Correction CSS for the Phone Dropdown !!! */}
      {/* Target the country names and codes to make them dark, ensuring high contrast and legibility */}
      <style>{`
        /* 1. Correct the illegible text in the open flag list */
        /* Target the country name text */
        .react-phone-input-container .country-list .country .country-name,
        /* Target the dial code text (e.g., +91) */
        .react-phone-input-container .country-list .country .dial-code {
          color: #333 !important; /* Forces dark grey for all unselected countries and codes for high contrast on the white list item background */
        }

        /* 2. Improve legibility of the selected item in the list */
        /* Target text color of the selected list item to be dark for high contrast against the selection color */
        .react-phone-input-container .country-list .country.selected .country-name,
        .react-phone-input-container .country-list .country.selected .dial-code {
          color: #222 !important; /* Forces dark color on the selected item to avoid conflicts */
        }
        
        /* 3. Style the search input to match the dark theme */
        .react-phone-input-container .country-list .search {
            background-color: #222 !important;
            padding: 8px !important;
        }
        .react-phone-input-container .country-list .search-box {
            background: #1a1a1c !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: white !important;
            border-radius: 6px !important;
            padding: 5px 8px !important;
        }

        /* General layout styles to match form aesthetic */
        .phone-container { width: 100% !important; }
        .phone-input-field { 
          width: 100% !important; 
          background: #08090a !important; 
          border: 1px solid rgba(255,255,255,0.1) !important; 
          color: white !important; 
          height: 46px !important; 
          border-radius: 12px !important;
          padding-left: 58px !important;
        }
        .phone-dropdown-btn { 
          background: #08090a !important; 
          border: 1px solid rgba(255,255,255,0.1) !important; 
          border-radius: 12px 0 0 12px !important;
          width: 50px !important;
        }
        .phone-input-field:focus { border-color: #a855f7 !important; }
        .react-phone-input-container .country-list {
            border-radius: 8px;
            margin-top: 5px;
            border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

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

export default Register;