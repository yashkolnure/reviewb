import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sparkles, LayoutGrid, Star, ArrowRight, MapPin, Loader2, RefreshCw } from 'lucide-react';

const Overview = ({ user }) => {
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Fetch Locations if connected but none selected
  // 2. Fetch Reviews if location is already selected
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (user?.googleConnected && !user?.googleLocationId) {
        const res = await axios.get('/api/auth/google/locations', config);
        setLocations(res.data || []);
      } else if (user?.googleLocationId) {
        const res = await axios.get('/api/business/reviews', config);
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error("Data fetch failed", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleConnectGoogle = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/auth/google/url?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Error connecting to Google API");
    }
  };

  const selectLocation = async (loc) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/google/save-location', {
        locationId: loc.name,
        businessName: loc.title
      }, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload(); 
    } catch (err) {
      alert("Failed to save location");
    }
  };

  // --- Dynamic Stats Calculations ---
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.starRating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  const unrepliedCount = reviews.filter(rev => !rev.reviewReply).length;
  const responseRate = totalReviews > 0 
    ? Math.round(((totalReviews - unrepliedCount) / totalReviews) * 100) 
    : 0;

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;

  // --- STATE A: NOT CONNECTED ---
  if (!user?.googleConnected) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-[#111214] border border-white/5 p-12 rounded-[40px] text-center max-w-xl shadow-2xl">
          <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
            <LayoutGrid className="text-purple-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect your Business</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Sync your Google Business Profile to start managing reviews and generating AI replies.
          </p>
          <button onClick={handleConnectGoogle} className="group flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-purple-50 transition-all active:scale-95">
            Connect Google Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>
    );
  }

  // --- STATE B: CONNECTED BUT NO LOCATION SELECTED ---
  if (user?.googleConnected && !user?.googleLocationId) {
    return (
      <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold text-white mb-2">Select a Location</h2>
        <p className="text-gray-500 mb-10">Choose the business profile you want to automate.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div key={loc.name} className="bg-[#111214] p-8 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><MapPin className="text-gray-400" /></div>
                <button onClick={() => selectLocation(loc)} className="bg-purple-600/10 text-purple-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-600 hover:text-white transition-all">Select</button>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{loc.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-1">{loc.storefrontAddress?.addressLines?.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- STATE C: FULL DASHBOARD ---
  return (
    <div className="p-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            {user.businessName} • Pune 
            <button onClick={() => { setIsRefreshing(true); fetchData(); }} className="hover:text-purple-400 transition-colors">
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </p>
        </div>
        <button className="bg-purple-600 px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all">
          <Sparkles size={18}/> Auto-Reply All
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Reviews" value={totalReviews} color="text-green-500" />
        <StatCard label="Avg. Rating" value={`${avgRating} ★`} color="text-yellow-500" />
        <StatCard label="Response Rate" value={`${responseRate}%`} color="text-purple-500" />
        <StatCard label="Unreplied" value={unrepliedCount} color="text-red-500" />
      </div>

      <div className="bg-[#111214] rounded-[32px] border border-white/5 p-8">
        <h3 className="text-xl font-bold text-white mb-8">Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem 
                key={review.reviewId} 
                review={review} 
                businessName={user.businessName} 
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">No reviews found for this location.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ label, value, color }) => (
  <div className="bg-[#111214] p-6 rounded-3xl border border-white/5 shadow-sm">
    <p className="text-[10px] font-black text-gray-600 tracking-widest uppercase mb-1">{label}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);

const ReviewItem = ({ review, businessName }) => {
  const [aiReply, setAiReply] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/ai/generate-reply', {
        reviewText: review.comment,
        rating: review.starRating,
        businessName: businessName
      });
      setAiReply(res.data.reply);
    } catch (err) {
      alert("AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#18191b] p-6 rounded-2xl border border-white/5 flex flex-col gap-3 group transition-all">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center font-bold text-purple-500">
            {review.reviewer.displayName.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-white block">{review.reviewer.displayName}</span>
            <span className="text-[10px] text-gray-600 uppercase font-bold">{new Date(review.createTime).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex text-yellow-500 gap-1">
          {[...Array(review.starRating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
        </div>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{review.comment || "No comment provided."}</p>
      
      {review.reviewReply ? (
        <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Your Reply</p>
          <p className="text-gray-300 text-sm">{review.reviewReply.comment}</p>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          {aiReply && (
            <textarea 
              className="w-full bg-[#08090a] border border-purple-500/30 p-4 rounded-xl text-white text-sm outline-none focus:border-purple-500 transition-all"
              value={aiReply}
              onChange={(e) => setAiReply(e.target.value)}
              rows={3}
            />
          )}
          <div className="flex gap-2">
            <button 
              onClick={generateAI} 
              disabled={isGenerating}
              className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-lg hover:bg-purple-400 hover:text-white transition-all disabled:opacity-50"
            >
              <Sparkles size={14}/> {isGenerating ? "Generating..." : aiReply ? "Regenerate AI" : "Generate AI Reply"}
            </button>
            {aiReply && (
              <button className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-all">
                Post to Google
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;