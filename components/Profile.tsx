import React, { useState } from 'react';
import { User, Purchase, FeedItem } from '../types';
import { ShoppingBag, Disc, Share2, Heart, Play, Film, X, Globe, Lock, Music, User as UserIcon, Star, MessageCircle, LogOut } from 'lucide-react';

interface ProfileProps {
  user: User;
  isPublicView?: boolean;
  onUpdateUser?: (updatedUser: User) => void;
  onClose?: () => void;
  onLogout?: () => void;
}

// Mock Feed Data
const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'video',
    title: 'Origins: The Beginning',
    content: 'https://videos.pexels.com/video-files/5849603/5849603-hd_1920_1080_30fps.mp4',
    date: '1998-11-04',
    series: 'Series 1'
  },
  {
    id: 'f2',
    type: 'text',
    title: 'Natural Rhythms',
    content: 'The drum pattern is the heartbeat. The bass is the root system.',
    date: '1999-02-15',
    series: 'Series 1'
  },
  {
    id: 'f3',
    type: 'audio',
    title: 'Forest Sessions #004',
    content: 'audio-placeholder',
    thumbnail: 'https://picsum.photos/400/100',
    date: '2001-06-20',
    series: 'Series 2'
  },
  {
    id: 'f4',
    type: 'image',
    title: 'Field Gathering',
    content: 'https://picsum.photos/600/400?random=88',
    date: '2002-09-10',
    series: 'Series 3'
  },
];

const MOCK_PURCHASES: Purchase[] = [
  { id: '101', itemName: 'Organic Cotton Hoodie', price: 45.00, date: '2023-10-12', image: 'https://picsum.photos/200/200?random=3' },
  { id: '102', itemName: 'Digital Roots EP', price: 5.00, date: '2023-10-15', image: 'https://picsum.photos/200/200?random=4' },
];

export const Profile: React.FC<ProfileProps> = ({ user, isPublicView = false, onClose, onLogout }) => {
  const [accountTab, setAccountTab] = useState<'private' | 'public'>('private');

  return (
    <div className="w-full h-full flex flex-col text-sand font-sans overflow-hidden bg-bark/95">
      
      {/* Profile Header (Shared) */}
      {!isPublicView && (
        <div className="shrink-0 p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-moss to-clay flex items-center justify-center text-bark font-bold text-lg shadow-lg">
                 {user.username.substring(0,2).toUpperCase()}
               </div>
               <div>
                 <h1 className="text-3xl font-bold font-mono tracking-wide leading-none mb-1 text-sand">{user.username}</h1>
                 <p className="text-xs text-moss font-mono tracking-wider">MEMBER ID: {user.id.substring(0,8)}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               {onLogout && (
                 <button 
                   onClick={onLogout}
                   className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 hover:text-clay transition-all text-xs font-mono uppercase tracking-wider group"
                 >
                   <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                   <span className="hidden md:inline">Depart</span>
                 </button>
               )}
               
               {onClose && (
                 <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-sand">
                   <X size={24} />
                 </button>
               )}
             </div>
          </div>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* LEFT COLUMN: Feed (1/3 Width) */}
            <div className="w-full md:w-1/3 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-white/5 relative shrink-0 bg-black/10">
               <div className="p-6 md:p-8 space-y-8 max-w-xl mx-auto">
                 <div className="sticky top-0 bg-bark/95 backdrop-blur-xl z-20 py-4 -mt-4 mb-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-mono font-bold text-sand flex items-center gap-2">
                      <Film className="text-moss" size={20} />
                      FEED
                    </h2>
                    <div className="text-[10px] font-mono text-moss uppercase tracking-widest bg-moss/10 px-3 py-1 rounded-full">
                       Archive
                    </div>
                 </div>

                 <div className="space-y-12 relative pl-4 border-l border-white/10 ml-2">
                   {MOCK_FEED.map((item, index) => (
                      <div key={item.id} className="relative group animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                         {/* Timeline Node - Organic */}
                         <div className="absolute -left-[23px] top-6 w-3 h-3 bg-bark border-2 border-moss rounded-full z-10 group-hover:bg-moss transition-colors"></div>

                         <div className="bg-white/5 border border-white/5 p-6 rounded-[30px] hover:bg-white/10 transition-all duration-500 hover:shadow-xl">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                               <span className="text-[10px] font-mono text-stone-400">{item.date}</span>
                               <div className="text-moss/70 text-xs font-mono uppercase flex items-center gap-1">
                                  {item.type}
                               </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 font-mono tracking-tight text-sand group-hover:text-moss transition-colors">{item.title}</h3>

                            {/* Content based on type */}
                            {item.type === 'video' && (
                               <div className="relative aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                                 <video src={item.content} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loop muted playsInline />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer hover:bg-moss hover:text-bark">
                                       <Play className="fill-current ml-1" size={24} />
                                    </div>
                                 </div>
                               </div>
                            )}

                            {item.type === 'image' && (
                               <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 shadow-lg">
                                 <img src={item.content} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" alt={item.title} />
                               </div>
                            )}

                            {item.type === 'text' && (
                               <div className="p-6 bg-moss/5 rounded-2xl font-serif text-lg italic leading-relaxed text-sand/90 relative">
                                 "{item.content}"
                               </div>
                            )}

                            {/* Actions */}
                            <div className="mt-5 flex gap-6 pt-4 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                               <button className="flex items-center gap-2 text-stone-400 hover:text-moss transition-colors text-xs font-mono uppercase">
                                  <Heart size={16} /> <span>Save</span>
                               </button>
                               <button className="flex items-center gap-2 text-stone-400 hover:text-sand transition-colors text-xs font-mono uppercase">
                                  <Share2 size={16} /> <span>Share</span>
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                 </div>
               </div>
            </div>

             {/* RIGHT COLUMN: Account (2/3 Width) */}
             <div className="w-full md:w-2/3 overflow-y-auto custom-scrollbar bg-black/20 relative">
                
                {/* Account Toggle Header */}
                <div className="sticky top-0 bg-bark/95 backdrop-blur-xl z-30 border-b border-white/5 px-8 py-5 flex items-center justify-between">
                    <div className="flex gap-1 p-1 bg-black/20 rounded-full border border-white/5">
                        <button 
                          onClick={() => setAccountTab('private')}
                          className={`
                            px-6 py-2 rounded-full text-sm font-mono font-bold uppercase transition-all flex items-center gap-2
                            ${accountTab === 'private' ? 'bg-sand text-bark shadow-md' : 'text-stone-500 hover:text-sand'}
                          `}
                        >
                            <Lock size={14} />
                            Account
                        </button>
                        <button 
                          onClick={() => setAccountTab('public')}
                          className={`
                            px-6 py-2 rounded-full text-sm font-mono font-bold uppercase transition-all flex items-center gap-2
                            ${accountTab === 'public' ? 'bg-moss text-bark shadow-md' : 'text-stone-500 hover:text-moss'}
                          `}
                        >
                            <Globe size={14} />
                            Profile
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-[calc(100vh-100px)]">
                    
                 {/* PRIVATE VIEW */}
                 {accountTab === 'private' && (
                     <div className="space-y-10 animate-fadeIn">
                        {/* Balance Card - Organic */}
                        <div className="bg-gradient-to-br from-stone-900 to-bark p-10 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-2xl">
                           <div className="absolute -right-20 -top-20 w-64 h-64 bg-moss/10 rounded-full blur-3xl group-hover:bg-moss/20 transition-all duration-1000 animate-breathe"></div>
                           <div className="relative z-10">
                             <div className="flex justify-between items-center mb-6">
                               <span className="text-stone-400 font-mono uppercase tracking-widest text-xs border border-white/10 px-3 py-1 rounded-full">Wallet</span>
                               <div className="w-3 h-3 rounded-full bg-moss shadow-[0_0_15px_rgba(132,204,22,0.4)]"></div>
                             </div>
                             <div className="text-7xl font-bold font-mono text-sand tracking-tighter mb-10">
                               £{user.walletBalance.toFixed(2)}
                             </div>
                             <div className="flex flex-col md:flex-row gap-4">
                                <button className="flex-1 bg-sand text-bark text-sm font-bold py-4 rounded-full hover:bg-moss hover:scale-[1.02] transition-all duration-300 uppercase tracking-wider shadow-lg">
                                   Add Funds
                                </button>
                                <button className="flex-1 bg-transparent border border-white/20 text-sand text-sm font-bold py-4 rounded-full hover:border-sand hover:bg-white/5 transition-all duration-300 uppercase tracking-wider">
                                   Withdraw
                                </button>
                             </div>
                           </div>
                        </div>

                        {/* Purchases List */}
                        <div className="glass-panel rounded-[30px] overflow-hidden">
                           <div className="p-8 border-b border-white/5">
                               <h3 className="text-sm font-mono font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider">
                               <ShoppingBag size={16} />
                               Collection
                               </h3>
                           </div>
                           <div className="divide-y divide-white/5">
                              {MOCK_PURCHASES.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group cursor-pointer">
                                   <div className="flex items-center gap-6">
                                      <div className="w-16 h-16 rounded-2xl bg-stone-800 overflow-hidden shadow-md">
                                         <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.itemName} />
                                      </div>
                                      <div>
                                         <div className="font-bold text-sand text-lg group-hover:text-moss transition-colors">{item.itemName}</div>
                                         <div className="text-xs text-stone-500 font-mono mt-1">{item.date}</div>
                                      </div>
                                   </div>
                                   <div className="font-mono text-sand text-lg">
                                      -£{item.price.toFixed(2)}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                 )}

                 {/* PUBLIC VIEW (Myspace Style but Organic) */}
                 {accountTab === 'public' && (
                     <div 
                        className="animate-fadeIn p-8 rounded-[30px] border border-white/10 min-h-[600px] relative shadow-2xl"
                        style={{
                            backgroundColor: user.profileStyle?.backgroundColor || '#1c1917',
                            color: user.profileStyle?.textColor || '#e7e5e4',
                            fontFamily: user.profileStyle?.fontFamily || 'Bebas Neue',
                        }}
                     >
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <div className="w-56 flex flex-col gap-4">
                                <div className="aspect-square bg-stone-800 p-2 rounded-3xl shadow-inner">
                                    <div className="w-full h-full bg-gradient-to-br from-stone-700 to-black rounded-2xl flex items-center justify-center overflow-hidden">
                                        <UserIcon size={64} className="text-stone-500 opacity-50" />
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-xl font-bold">{user.username}</p>
                                    <p className="text-xs opacity-60 font-mono">London, UK</p>
                                </div>
                                
                                <div className="space-y-2 mt-2">
                                    <button className="w-full py-2 bg-moss/20 text-moss rounded-full text-xs font-bold hover:bg-moss hover:text-bark transition-colors uppercase">
                                       Message
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="glass-panel p-6 rounded-3xl">
                                    <h3 className="text-lg font-bold text-moss mb-3 uppercase tracking-wide">About Me</h3>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-90 font-sans">
                                        {user.bio || "Searching for the perfect beat. \n\nNature is the ultimate sound system."}
                                    </p>
                                </div>
                                
                                <div className="glass-panel p-6 rounded-3xl">
                                    <h3 className="text-lg font-bold text-moss mb-3 uppercase tracking-wide">Current Vibe</h3>
                                    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl">
                                        <div className="w-10 h-10 bg-clay rounded-full flex items-center justify-center text-bark shadow-lg">
                                            <Play size={16} fill="currentColor" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                                                <div className="h-full w-1/2 bg-clay animate-pulse"></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-mono opacity-70">
                                                <span>FOREST_DUB_02.MP3</span>
                                                <span>2:45</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Friends */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-moss mb-4 uppercase tracking-wide">
                                Tribe <span className="text-sm font-normal text-sand opacity-50 ml-2">(12)</span>
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                {[1,2,3,4,5,6].map((i) => (
                                    <div key={i} className="flex flex-col items-center group cursor-pointer gap-2">
                                        <div className="w-full aspect-square bg-stone-800 rounded-full overflow-hidden border-2 border-transparent group-hover:border-moss transition-all">
                                            <img src={`https://picsum.photos/100/100?random=${i+20}`} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all" alt="Friend" />
                                        </div>
                                        <span className="text-[10px] font-bold opacity-60 group-hover:opacity-100 group-hover:text-moss uppercase">User_{i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                 )}
              </div>
            </div>
      </div>
    </div>
  );
};