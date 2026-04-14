import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Wand2, RefreshCw } from 'lucide-react';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/YOUR_BUSINESS_ID', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleAiReply = async (reviewId, comment, rating) => {
    try {
      const res = await axios.post('/api/ai/generate', 
        { comment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Logic to update UI with the draft reply
      console.log("AI Suggestion:", res.data.reply);
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-white">Google Reviews</h2>
        <button onClick={fetchReviews} className="text-teal hover:text-white transition">
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev._id} className="bg-panel p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between">
              <span className="font-bold text-white">{rev.reviewerName}</span>
              <div className="flex text-yellow-500">
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-400 mt-2">{rev.comment || "No text provided."}</p>
            <div className="mt-4 flex gap-4">
              <button 
                onClick={() => handleAiReply(rev._id, rev.comment, rev.rating)}
                className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest"
              >
                <Wand2 size={14} /> AI Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;