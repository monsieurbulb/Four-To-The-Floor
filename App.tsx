
import React, { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { Chat } from './components/Chat';
import { AdminPanel } from './components/AdminPanel';
import { AdminControls } from './components/AdminControls';
import { Shop } from './components/Shop';
import { Walkthrough } from './components/Walkthrough';
import { HelpAgent } from './components/HelpAgent';
import { User, FeedItem, Product } from './types';
import { User as UserIcon, LogOut, Radio, Twitter, Facebook, Copy, Leaf } from 'lucide-react';
import { ASSETS } from './constants';

const INITIAL_FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'video',
    title: 'Series 1: The Beginning',
    content: 'https://videos.pexels.com/video-files/5849603/5849603-hd_1920_1080_30fps.mp4',
    date: '1998-11-04',
    series: 'Series 1'
  },
  {
    id: 'f2',
    type: 'text',
    title: 'Studio Update',
    content: 'The drum pattern is the heartbeat. The bass is the root system.',
    date: '1999-02-15',
    series: 'Series 1'
  },
  {
    id: 'f3',
    type: 'audio',
    title: 'Live Session #004',
    content: 'audio-placeholder',
    thumbnail: 'https://picsum.photos/400/100',
    date: '2001-06-20',
    series: 'Series 2'
  },
  {
    id: 'f4',
    type: 'image',
    title: 'Rave Photo',
    content: 'https://picsum.photos/600/400?random=88',
    date: '2002-09-10',
    series: 'Series 3'
  },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'stream' | 'profile' | 'admin' | 'shop'>('stream');
  const [showAuth, setShowAuth] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
  // Lifted state for Feed Items so Admin can modify it
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED);

  // Background style
  useEffect(() => {
     document.body.style.backgroundImage = `url(${ASSETS.globalBackground})`;
     document.body.style.backgroundSize = 'cover';
     document.body.style.backgroundAttachment = 'fixed';
     document.body.style.backgroundPosition = 'center';
  }, []);

  // Mock checking session
  useEffect(() => {
    const storedUser = localStorage.getItem('fttf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowAuth(false);
    }
  }, []);

  const handleLogin = (userData: User) => {
    const sanitizedUser: User = {
      ...userData,
      subscribedEventIds: userData.subscribedEventIds || [],
      isAdmin: userData.isAdmin || false,
      walletAddress: userData.walletAddress || undefined,
      points: userData.points || 0, 
      assets: userData.assets || [], 
    };
    setUser(sanitizedUser);
    localStorage.setItem('fttf_user', JSON.stringify(sanitizedUser));
    setShowAuth(false);
    
    // Trigger Walkthrough for new logins (or demo purposes)
    // In production, check a 'hasSeenTour' flag
    setShowWalkthrough(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('fttf_user');
    setUser(null);
    setShowAuth(true);
    setCurrentView('stream');
    setShowWalkthrough(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fttf_user', JSON.stringify(updatedUser));
  };

  const handleAddFeedItem = (newItem: FeedItem) => {
    setFeedItems(prev => [newItem, ...prev]);
  };

  const handleUseAsset = (assetId: string) => {
      if (!user || !user.assets) return;
      
      const updatedAssets = user.assets.map(a => {
          if (a.id === assetId && a.quantity > 0) {
              return { ...a, quantity: a.quantity - 1 };
          }
          return a;
      });

      const updatedUser = { ...user, assets: updatedAssets };
      handleUpdateUser(updatedUser);
  };

  const handleSubscribe = () => {
      if (!user) return;
      const updatedUser = { ...user, points: (user.points || 0) + 50 };
      handleUpdateUser(updatedUser);
      alert('Subscribed! You earned 50 PTS.');
  };

  const handlePurchase = (product: Product, currency: 'cash' | 'points') => {
      if (!user) return;

      let newBalance = user.walletBalance;
      let newPoints = user.points;
      
      // Deduct Cost
      if (currency === 'cash') {
          if (user.walletBalance < (product.priceCash || 0)) {
              alert('Insufficient funds.');
              return;
          }
          newBalance -= (product.priceCash || 0);
      } else {
          if (user.points < (product.pricePoints || 0)) {
              alert('Insufficient points.');
              return;
          }
          newPoints -= (product.pricePoints || 0);
      }

      // Add Assets
      const currentAssets = user.assets || [];
      const newAssets = [...currentAssets];

      product.assets.forEach(productAsset => {
          const existing = newAssets.find(a => a.name === productAsset.name && a.type === productAsset.type);
          if (existing) {
              existing.quantity += productAsset.quantity;
          } else {
              newAssets.push(productAsset);
          }
      });

      const updatedUser = {
          ...user,
          walletBalance: newBalance,
          points: newPoints,
          assets: newAssets
      };

      handleUpdateUser(updatedUser);
      alert(`Purchased ${product.name}! Items added to stash.`);
  };

  const shareStream = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Connecting to the organic frequency on Four To The Floor.");
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard.');
    }
  };

  return (
    <div className="min-h-screen bg-bark text-sand relative overflow-x-hidden selection:bg-moss selection:text-bark">
      
      {/* Auth Gating */}
      {showAuth && <AuthModal onLogin={handleLogin} />}

      {/* Admin Controls Footer (Z-Index High) */}
      <AdminControls 
         user={user} 
         onLogin={handleLogin} 
         onOpenCMS={() => setCurrentView('admin')}
         currentView={currentView}
      />

      {/* AI Helper "James" (Bottom Right, Stacked) */}
      {!showAuth && user && (
          <HelpAgent username={user.username} />
      )}

      {/* Walkthrough Tutorial Overlay */}
      {showWalkthrough && !showAuth && (
          <Walkthrough 
             onClose={() => setShowWalkthrough(false)} 
             onNavigate={(view) => setCurrentView(view as any)}
          />
      )}

      {/* Main App Navigation (Floating) */}
      {!showAuth && user && (
        <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
           <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center shadow-lg">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => setCurrentView('stream')}
              >
                <div className={`w-3 h-3 rounded-full ${currentView === 'stream' ? 'bg-moss animate-breathe' : 'bg-stone-500'}`}></div>
                <span className="font-mono font-bold tracking-tighter text-xl group-hover:text-moss transition-colors">FTTF</span>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={() => setCurrentView('stream')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${currentView === 'stream' ? 'bg-sand text-bark' : 'text-stone-400 hover:text-sand hover:bg-white/5'}`}
                >
                  <Radio className="w-3 h-3" />
                  <span className="hidden md:inline">STREAM</span>
                </button>
                
                <button 
                  onClick={() => setCurrentView(currentView === 'profile' ? 'stream' : 'profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${currentView === 'profile' ? 'bg-sand text-bark' : 'text-stone-400 hover:text-sand hover:bg-white/5'}`}
                >
                  {user.profileImage ? (
                     <img src={user.profileImage} className="w-5 h-5 rounded-full border border-white/20" />
                  ) : (
                     <UserIcon className="w-3 h-3" />
                  )}
                  <span className="hidden md:inline">{user.username}</span>
                </button>
                
                <div className="h-4 w-px bg-white/10 mx-1 md:mx-2"></div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-clay transition-colors rounded-full hover:bg-white/5"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
           </div>
        </nav>
      )}

      {/* Content Area */}
      <main className={`pt-24 min-h-screen transition-opacity duration-700 relative ${showAuth ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Stream Layer (Always Visible in Background) */}
        <div className="animate-fadeIn p-4 md:p-8 flex flex-col items-center gap-8 w-full max-w-[1920px] mx-auto">
            
            {/* Extended Width Video Player */}
            <div className="w-full max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[40px] overflow-hidden border border-white/5 relative z-10 bg-bark">
              <VideoPlayer 
                user={user || undefined}
                onUseAsset={handleUseAsset}
                onSubscribe={handleSubscribe}
              /> 
            </div>
            
            {/* Info & Chat Grid */}
            <div className="w-full max-w-[90vw] grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
              
              {/* Info Box */}
              <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-start gap-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-moss/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-moss/15 transition-colors duration-1000"></div>

                  <div className="space-y-5 max-w-2xl relative z-10">
                    <div className="flex items-center gap-3">
                      <Leaf className="text-moss w-4 h-4" />
                      <span className="text-moss font-mono text-xs tracking-widest uppercase">LIVE STREAM</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-mono text-sand tracking-tighter w-fit">FOUR TO THE FLOOR</h1>
                    <p className="text-stone-400 leading-relaxed text-sm md:text-base font-sans max-w-lg">
                      The definitive archive and live streaming platform for Drum and Bass culture. 
                      Connecting the underground since 1994.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="bg-black/20 border border-white/5 px-4 py-2 rounded-full text-xs text-stone-300 font-mono">#DNB</span>
                      <span className="bg-black/20 border border-white/5 px-4 py-2 rounded-full text-xs text-stone-300 font-mono">#JUNGLE</span>
                      <span className="bg-black/20 border border-white/5 px-4 py-2 rounded-full text-xs text-stone-300 font-mono">#BREAKBEAT</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto relative z-10">
                    <h3 className="text-xs font-mono uppercase text-stone-500 mb-1 ml-1">SHARE</h3>
                    <div className="flex gap-2">
                      <button onClick={() => shareStream('twitter')} className="p-4 bg-black/20 border border-white/5 hover:border-moss/50 rounded-full hover:bg-moss hover:text-bark transition-all">
                          <Twitter size={18} />
                      </button>
                      <button onClick={() => shareStream('facebook')} className="p-4 bg-black/20 border border-white/5 hover:border-moss/50 rounded-full hover:bg-moss hover:text-bark transition-all">
                          <Facebook size={18} />
                      </button>
                      <button onClick={() => shareStream('copy')} className="p-4 bg-black/20 border border-white/5 hover:border-moss/50 rounded-full hover:bg-moss hover:text-bark transition-all">
                          <Copy size={18} />
                      </button>
                    </div>
                  </div>
              </div>

              {/* Chat Column */}
              <div className="lg:col-span-1 h-[500px] lg:h-auto">
                  {user && <Chat user={user} />}
              </div>

            </div>
        </div>

        {/* Overlays */}
        {currentView === 'profile' && user && (
          <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-full bg-bark/95 backdrop-blur-2xl z-40 overflow-hidden animate-fadeIn pt-20">
            <Profile 
              user={user} 
              onUpdateUser={handleUpdateUser}
              onClose={() => setCurrentView('stream')}
              onLogout={handleLogout}
              onOpenShop={() => setCurrentView('shop')}
              feedItems={feedItems}
            />
          </div>
        )}

        {currentView === 'shop' && user && (
            <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-full bg-bark/95 backdrop-blur-2xl z-50 overflow-hidden animate-fadeIn pt-20">
                <Shop 
                    user={user}
                    onPurchase={handlePurchase}
                    onClose={() => setCurrentView('profile')}
                />
            </div>
        )}

        {currentView === 'admin' && user?.isAdmin && (
            <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-full bg-bark/95 backdrop-blur-2xl z-50 overflow-hidden animate-fadeIn pt-20">
                <AdminPanel 
                    onAddItem={handleAddFeedItem}
                    onClose={() => setCurrentView('stream')}
                    items={feedItems}
                />
            </div>
        )}
      </main>

    </div>
  );
}
