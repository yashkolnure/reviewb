import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Overview from '../tabs/Overview';
import Reviews from '../tabs/Reviews';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile to check googleConnected status
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Session expired");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center text-white">Initializing...</div>;

  return (
    <div className="flex min-h-screen bg-[#08090a]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'Dashboard' && <Overview user={user} />}
        {activeTab === 'Reviews' && <Reviews user={user} />}
        {/* Add other tabs here */}
      </main>
    </div>
  );
};

export default Dashboard;