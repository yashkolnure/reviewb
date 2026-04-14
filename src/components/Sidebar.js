import React from 'react';
import { LayoutDashboard, MessageSquare, Sparkles, Send, BarChart3, MapPin, CreditCard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { name: 'Reviews', icon: <MessageSquare size={18}/>, badge: '3' },
    { name: 'AI Replies', icon: <Sparkles size={18}/>, tag: 'New' },
    { name: 'Analytics', icon: <BarChart3 size={18}/> },
  ];

  return (
    <aside className="w-64 bg-[#111214] border-r border-white/5 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">R</div>
          <h1 className="text-white font-bold text-lg">ReviewPilot</h1>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === item.name ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 text-sm font-semibold">
                {item.icon} {item.name}
              </div>
              {item.badge && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-bold">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;