import React from 'react';
import axios from 'axios';
import { Sparkles, LayoutGrid, Star, ArrowRight } from 'lucide-react';

const Overview = ({ user }) => {
  
  const handleConnectGoogle = async () => {
    try {
      const token = localStorage.getItem('token');
      // Step 1: Get the OAuth URL from backend
      const res = await axios.get(`http://localhost:5000/api/auth/google/url?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Step 2: Redirect to Google
      window.location.href = res.data.url;
    } catch (err) {
      alert("Error connecting to Google API");
    }
  };

  // STATE A: Not Connected
  if (!user?.googleConnected) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-[#111214] border border-white/5 p-12 rounded-[40px] text-center max-w-xl shadow-2xl">
          <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
            <LayoutGrid className="text-purple-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect your Business</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            To start managing reviews and generating AI replies, you need to sync your Google Business Profile.
          </p>
          <button 
            onClick={handleConnectGoogle}
            className="group flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-purple-50 transition-all active:scale-95"
          >
            Connect Google Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </button>
          <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-bold">Secure OAuth2 Integration</p>
        </div>
      </div>
    );
  }

  // STATE B: Connected (The UI from your image)
  return (
    <div className="p-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-sm">{user.businessName || "Your Business"} • Pune</p>
        </div>
        <button className="bg-purple-600 px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all">
          <Sparkles size={18}/> Auto-Reply All
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Reviews" value="142" color="text-green-500" />
        <StatCard label="Avg. Rating" value="4.7 ★" color="text-yellow-500" />
        <StatCard label="Response Rate" value="68%" color="text-purple-500" />
        <StatCard label="Unreplied" value="3" color="text-red-500" />
      </div>

      {/* Review List Section */}
      <div className="bg-[#111214] rounded-[32px] border border-white/5 p-8">
        <h3 className="text-xl font-bold text-white mb-8">Recent Reviews</h3>
        <div className="space-y-4">
          <ReviewItem name="Priya Mehta" rating={5} text="Absolutely love this place! The cold brew is to die for." />
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ label, value, color }) => (
  <div className="bg-[#111214] p-6 rounded-3xl border border-white/5 shadow-sm">
    <p className="text-[10px] font-black text-gray-600 tracking-widest uppercase mb-1">{label}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);

const ReviewItem = ({ name, rating, text }) => (
  <div className="bg-[#18191b] p-6 rounded-2xl border border-white/5 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">PM</div>
        <span className="font-bold text-white">{name}</span>
      </div>
      <div className="flex text-yellow-500 gap-1">
        {[...Array(rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    <button className="w-fit flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-lg mt-2">
      <Sparkles size={14}/> Generate AI Reply
    </button>
  </div>
);

export default Overview;