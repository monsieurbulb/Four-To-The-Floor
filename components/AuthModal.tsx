import React, { useState } from 'react';
import { User, DEFAULT_STYLE } from '../types';
import { ArrowRight, Lock } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: username || 'Nomad',
      email: email || 'user@example.com',
      walletBalance: 0,
      bio: '',
      profileStyle: DEFAULT_STYLE,
      following: [],
      subscribedEventIds: [],
    };
    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-bark flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-moss/20 rounded-full blur-[120px] animate-blob"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-clay/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
         {/* Subtle Grain */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-md glass-panel p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="text-center mb-8">
           <h1 className="text-4xl font-bold font-mono tracking-tighter text-sand mb-2 liquid-text">FOUR TO THE FLOOR</h1>
           <p className="text-sm font-mono text-stone-400 tracking-widest uppercase">
             <Lock className="inline w-3 h-3 mr-2" />
             Community Access
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
             <div className="space-y-1">
               <label className="text-xs font-mono text-moss ml-3">Identity</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sand focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss/50 transition-all font-mono"
                 placeholder="Choose Alias"
                 required={!isLogin}
               />
             </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-mono text-moss ml-3">Contact</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sand focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss/50 transition-all font-mono"
              placeholder="email@address.com"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-sand hover:bg-moss text-bark font-bold py-4 rounded-full mt-6 flex items-center justify-center gap-2 transition-all group shadow-lg hover:shadow-moss/20"
          >
            <span>{isLogin ? 'RETURN' : 'ENTER'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-stone-500 hover:text-sand transition-colors"
          >
            {isLogin ? "NEW SOUL? JOIN US" : "RETURNING? LOGIN"}
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full text-[10px] text-stone-600 font-mono">
        EST. 2024 // EARTH // ORGANIC FREQUENCIES
      </div>
    </div>
  );
};