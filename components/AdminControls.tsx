
import React from 'react';
import { Settings, Shield, Terminal } from 'lucide-react';
import { User, DEFAULT_STYLE } from '../types';

interface AdminControlsProps {
  user: User | null;
  onLogin: (user: User) => void;
  onOpenCMS: () => void;
  currentView: string;
}

export const AdminControls: React.FC<AdminControlsProps> = ({ user, onLogin, onOpenCMS, currentView }) => {
  
  const loginAdmin = () => {
      const adminUser: User = {
          id: 'admin-' + Date.now(),
          username: 'Core Team',
          email: 'core@fttf.local',
          walletBalance: 50000,
          points: 50000,
          walletAddress: '0x0000000000000000000000000000000000000000',
          bio: 'Platform Administrator',
          profileStyle: DEFAULT_STYLE,
          following: [],
          subscribedEventIds: [],
          isAdmin: true,
          profileImage: 'https://ui-avatars.com/api/?name=Core+Team&background=2dd4bf&color=1c1917'
      };
      onLogin(adminUser);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 group pointer-events-auto">
      
      {/* State: Logged Out -> Show Admin Login Trigger */}
      {!user && (
        <button 
          onClick={loginAdmin}
          className="bg-black/40 hover:bg-moss text-stone-600 hover:text-bark border border-white/5 hover:border-moss p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-2xl flex items-center gap-2"
          title="Core Team Access"
        >
          <Shield size={16} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-mono text-[10px] uppercase font-bold whitespace-nowrap">
            System Override
          </span>
        </button>
      )}

      {/* State: Logged In as User (Not Admin) -> Show Switch to Admin */}
      {user && !user.isAdmin && (
        <button 
          onClick={loginAdmin}
          className="bg-black/40 hover:bg-clay text-stone-600 hover:text-bark border border-white/5 hover:border-clay p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-2xl flex items-center gap-2"
          title="Switch to Admin"
        >
          <Shield size={16} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-mono text-[10px] uppercase font-bold whitespace-nowrap">
            Switch to Admin
          </span>
        </button>
      )}

      {/* State: Logged In as Admin -> Show CMS Trigger */}
      {user && user.isAdmin && (
        <button 
          onClick={onOpenCMS}
          className={`
            p-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-2xl border flex items-center gap-3
            ${currentView === 'admin' 
              ? 'bg-clay text-bark border-clay rotate-180' 
              : 'bg-black/80 text-moss border-moss/50 hover:bg-moss hover:text-bark'
            }
          `}
          title="Content Management System"
        >
          <Settings size={20} className={currentView === 'admin' ? 'animate-spin-slow' : ''} />
          {currentView !== 'admin' && (
             <span className="font-mono text-xs font-bold uppercase hidden md:inline">CMS Console</span>
          )}
        </button>
      )}
    </div>
  );
};
