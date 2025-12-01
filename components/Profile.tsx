
import React, { useState } from 'react';
import { User, Purchase, FeedItem, Contact } from '../types';
import { ShoppingBag, Share2, Heart, Play, Film, X, Globe, Lock, User as UserIcon, LogOut, ArrowUpRight, ArrowDownLeft, QrCode, Copy, ChevronLeft, Package, Zap, Maximize2, Minimize2 } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface ProfileProps {
  user: User;
  isPublicView?: boolean;
  onUpdateUser?: (updatedUser: User) => void;
  onClose?: () => void;
  onLogout?: () => void;
  onOpenShop?: () => void;
  feedItems: FeedItem[];
}

const MOCK_PURCHASES: Purchase[] = [
  { id: '101', itemName: 'Limited Hoodie', price: 45.00, date: '2023-10-12', image: 'https://picsum.photos/200/200?random=3', lineup: [] },
  { id: '102', itemName: 'Digital EP', price: 5.00, date: '2023-10-15', image: 'https://picsum.photos/200/200?random=4', lineup: ['DJ Darkmatter'] },
];

const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'DJ Darkmatter', walletAddress: '0x71...3A92', avatar: 'https://picsum.photos/100/100?random=50' },
  { id: 'c2', name: 'Studio One', walletAddress: '0x82...B12C', avatar: 'https://picsum.photos/100/100?random=51' },
  { id: 'c3', name: 'Sarah B', walletAddress: '0x99...F44D', avatar: 'https://picsum.photos/100/100?random=52' },
  { id: 'c4', name: 'Vault Archive', walletAddress: '0x12...99AA', avatar: 'https://picsum.photos/100/100?random=53' },
];

export const Profile: React.FC<ProfileProps> = ({ user, isPublicView = false, onClose, onLogout, onOpenShop, feedItems }) => {
  const [accountTab, setAccountTab] = useState<'private' | 'public'>('private');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isFeedExpanded, setIsFeedExpanded] = useState(false);
  
  // Wallet State
  const [walletView, setWalletView] = useState<'main' | 'send' | 'receive'>('main');
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopyAddress = () => {
    if (user.walletAddress) {
        navigator.clipboard.writeText(user.walletAddress);
        alert('Address copied to clipboard');
    }
  };

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Simulated Transaction: Sent £${sendAmount} to ${recipient}`);
      setSendAmount('');
      setRecipient('');
      setWalletView('main');
  };

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
                 <p className="text-xs text-moss font-mono tracking-wider">MEMBER ID: {user.id.substring(0,8)} {user.isAdmin && '// ADMIN ACCESS'}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               {onLogout && (
                 <button 
                   onClick={onLogout}
                   className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 hover:text-clay transition-all text-xs font-mono uppercase tracking-wider group"
                 >
                   <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                   <span className="hidden md:inline">LOGOUT</span>
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
            
            {/* LEFT COLUMN: Feed (Dynamic Width) */}
            <div className={`w-full ${isFeedExpanded ? 'md:w-2/3' : 'md:w-1/3'} overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-white/5 relative shrink-0 bg-black/10 transition-[width] duration-500 ease-in-out`}>
               <div className="p-6 md:p-8 space-y-8 max-w-xl mx-auto">
                 <div className="sticky top-0 bg-bark/95 backdrop-blur-xl z-20 py-4 -mt-4 mb-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-mono font-bold text-sand flex items-center gap-2">
                      <Film className="text-moss" size={20} />
                      FEED
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:block text-[10px] font-mono text-moss uppercase tracking-widest bg-moss/10 px-3 py-1 rounded-full">
                           LIVEPEER LIBRARY
                        </div>
                        <button 
                            onClick={() => setIsFeedExpanded(!isFeedExpanded)}
                            className="p-2 hover:bg-white/10 rounded-full text-stone-400 hover:text-sand transition-colors"
                            title={isFeedExpanded ? "Collapse Feed" : "Expand Feed"}
                        >
                            {isFeedExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                 </div>

                 <div className="space-y-12 relative pl-4 border-l border-white/10 ml-2">
                   {feedItems.map((item, index) => (
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
                                 {playingVideoId === item.id ? (
                                    <VideoPlayer playbackId={item.livepeerPlaybackId} />
                                 ) : (
                                   <>
                                    <img src={item.thumbnail || "https://picsum.photos/400/225"} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button 
                                          onClick={() => setPlayingVideoId(item.id)}
                                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer hover:bg-moss hover:text-bark"
                                        >
                                          <Play className="fill-current ml-1" size={24} />
                                        </button>
                                    </div>
                                   </>
                                 )}
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

             {/* RIGHT COLUMN: Account (Dynamic Width) */}
             <div className={`w-full ${isFeedExpanded ? 'md:w-1/3' : 'md:w-2/3'} overflow-y-auto custom-scrollbar bg-black/20 relative transition-[width] duration-500 ease-in-out`}>
                
                {/* Account Toggle Header */}
                <div className="sticky top-0 bg-bark/95 backdrop-blur-xl z-30 border-b border-white/5 px-8 py-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-1 p-1 bg-black/20 rounded-full border border-white/5 shrink-0">
                        <button 
                          onClick={() => setAccountTab('private')}
                          className={`
                            px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-mono font-bold uppercase transition-all flex items-center gap-2
                            ${accountTab === 'private' ? 'bg-sand text-bark shadow-md' : 'text-stone-500 hover:text-sand'}
                          `}
                        >
                            <Lock size={14} />
                            ACCOUNT
                        </button>
                        <button 
                          onClick={() => setAccountTab('public')}
                          className={`
                            px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-mono font-bold uppercase transition-all flex items-center gap-2
                            ${accountTab === 'public' ? 'bg-moss text-bark shadow-md' : 'text-stone-500 hover:text-moss'}
                          `}
                        >
                            <Globe size={14} />
                            PROFILE
                        </button>
                    </div>

                    {/* Shop Button */}
                    {onOpenShop && (
                        <button 
                            onClick={onOpenShop}
                            className="bg-clay/20 text-clay hover:bg-clay hover:text-bark px-5 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border border-clay/30 shrink-0"
                        >
                            <ShoppingBag size={14} />
                            <span className={isFeedExpanded ? 'hidden xl:inline' : ''}>The Shop</span>
                        </button>
                    )}
                </div>

                <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-[calc(100vh-100px)]">
                    
                 {/* PRIVATE VIEW */}
                 {accountTab === 'private' && (
                     <div className="space-y-10 animate-fadeIn">
                        
                        {/* WALLET CARD */}
                        <div className="bg-gradient-to-br from-stone-900 to-bark p-10 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-2xl min-h-[350px]">
                           {/* Organic Background Blobs */}
                           <div className="absolute -right-20 -top-20 w-64 h-64 bg-moss/10 rounded-full blur-3xl group-hover:bg-moss/20 transition-all duration-1000 animate-breathe pointer-events-none"></div>
                           
                           {/* === WALLET VIEW: MAIN === */}
                           {walletView === 'main' && (
                             <div className="relative z-10 flex flex-col h-full animate-fadeIn">
                               <div className="flex justify-between items-start mb-6">
                                 <div>
                                     <span className="text-stone-400 font-mono uppercase tracking-widest text-xs border border-white/10 px-3 py-1 rounded-full">Wallet Balance</span>
                                     <div className={`${isFeedExpanded ? 'text-4xl lg:text-5xl' : 'text-6xl lg:text-7xl'} font-bold font-mono text-sand tracking-tighter mt-2 transition-all duration-500`}>
                                        £{user.walletBalance.toFixed(2)}
                                     </div>
                                 </div>
                                 
                                 {/* Points Badge */}
                                 <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                                    <Zap className="text-clay mb-1" size={24} fill="currentColor" />
                                    <span className="text-2xl font-bold font-mono text-sand">{user.points}</span>
                                    <span className="text-[9px] uppercase tracking-widest text-stone-500">PTS</span>
                                 </div>
                               </div>
                               
                               <div className="text-stone-500 font-mono text-xs mb-10 tracking-wider truncate">
                                 {user.walletAddress ? user.walletAddress : 'Wallet Connecting...'}
                               </div>
                               
                               <div className="flex flex-col xl:flex-row gap-4 mt-auto">
                                  <button 
                                    onClick={() => setWalletView('send')}
                                    className="flex-1 bg-sand text-bark text-sm font-bold py-5 rounded-3xl hover:bg-moss hover:scale-[1.02] transition-all duration-300 uppercase tracking-wider shadow-lg flex items-center justify-center gap-3"
                                  >
                                     <ArrowUpRight size={20} /> SEND
                                  </button>
                                  <button 
                                    onClick={() => setWalletView('receive')}
                                    className="flex-1 bg-transparent border border-white/20 text-sand text-sm font-bold py-5 rounded-3xl hover:border-sand hover:bg-white/5 transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-3"
                                  >
                                     <ArrowDownLeft size={20} /> RECEIVE
                                  </button>
                               </div>
                             </div>
                           )}

                           {/* === WALLET VIEW: SEND === */}
                           {walletView === 'send' && (
                               <div className="relative z-10 flex flex-col h-full animate-fadeIn">
                                   <div className="flex items-center gap-4 mb-6">
                                       <button onClick={() => setWalletView('main')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <ChevronLeft size={24} />
                                       </button>
                                       <span className="text-xl font-mono font-bold text-sand uppercase">Send Funds</span>
                                   </div>

                                   <form onSubmit={handleSend} className="space-y-6">
                                        <div className="flex flex-col xl:flex-row gap-4">
                                            <div className="xl:w-1/3">
                                                <label className="text-[10px] font-mono uppercase text-stone-500 mb-1 block">Amount (£)</label>
                                                <input 
                                                    type="number" 
                                                    value={sendAmount} 
                                                    onChange={e => setSendAmount(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-lg font-mono text-sand focus:border-moss outline-none" 
                                                    placeholder="0.00"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-mono uppercase text-stone-500 mb-1 block">Recipient Address</label>
                                                <input 
                                                    type="text" 
                                                    value={recipient} 
                                                    onChange={e => setRecipient(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-lg font-mono text-sand focus:border-moss outline-none" 
                                                    placeholder="0x..."
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full bg-moss text-bark font-bold py-4 rounded-3xl hover:bg-white transition-colors uppercase tracking-widest shadow-lg">
                                            Confirm Transfer
                                        </button>
                                   </form>
                               </div>
                           )}

                           {/* === WALLET VIEW: RECEIVE === */}
                           {walletView === 'receive' && (
                               <div className="relative z-10 flex flex-col h-full animate-fadeIn items-center justify-center">
                                    <div className="absolute top-0 left-0">
                                       <button onClick={() => setWalletView('main')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <ChevronLeft size={24} />
                                       </button>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-3xl mb-6 shadow-xl relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-moss to-clay rounded-3xl blur opacity-40 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative bg-white rounded-2xl p-2">
                                            <QrCode size={180} className="text-black" />
                                        </div>
                                    </div>

                                    <div className="text-center w-full max-w-md">
                                        <button 
                                            onClick={handleCopyAddress}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-moss/50 transition-colors group"
                                        >
                                            <span className="font-mono text-sm text-sand truncate opacity-80 group-hover:opacity-100">{user.walletAddress || '0x...'}</span>
                                            <Copy size={16} className="text-stone-500 group-hover:text-moss" />
                                        </button>
                                    </div>
                               </div>
                           )}
                        </div>

                        {/* STASH / INVENTORY */}
                        <div className="glass-panel rounded-[30px] overflow-hidden p-8">
                             <h3 className="text-sm font-mono font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider mb-6">
                               <Package size={16} />
                               The Stash (Inventory)
                             </h3>
                             
                             {(!user.assets || user.assets.length === 0) ? (
                                 <div className="text-center py-8">
                                     <p className="text-stone-500 text-sm font-mono mb-4">Your stash is empty.</p>
                                     <button onClick={onOpenShop} className="px-6 py-2 bg-moss/10 text-moss rounded-full text-xs font-bold uppercase hover:bg-moss hover:text-bark transition-colors">
                                         Visit Shop
                                     </button>
                                 </div>
                             ) : (
                                 <div className={`grid gap-4 ${isFeedExpanded ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                                     {user.assets.map(asset => (
                                         <div key={asset.id} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-2 group hover:border-moss/30 transition-colors">
                                             <div className="text-4xl group-hover:scale-110 transition-transform">{asset.icon}</div>
                                             <div className="text-xs font-bold text-sand uppercase">{asset.name}</div>
                                             <div className="text-[10px] font-mono text-stone-500 px-2 py-0.5 bg-black/40 rounded-full">
                                                 x{asset.quantity} left
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
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
                                      <div className="w-16 h-16 rounded-2xl bg-stone-800 overflow-hidden shadow-md shrink-0">
                                         <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.itemName} />
                                      </div>
                                      <div>
                                         <div className="font-bold text-sand text-lg group-hover:text-moss transition-colors">{item.itemName}</div>
                                         <div className="text-xs text-stone-500 font-mono mt-1">{item.date}</div>
                                      </div>
                                   </div>
                                   <div className="font-mono text-sand text-lg whitespace-nowrap">
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
                        <div className="flex flex-col xl:flex-row gap-8 mb-10">
                            <div className="w-full xl:w-56 flex flex-col gap-4">
                                <div className="aspect-square bg-stone-800 p-2 rounded-3xl shadow-inner mx-auto xl:mx-0 w-48 xl:w-auto">
                                    <div className="w-full h-full bg-gradient-to-br from-stone-700 to-black rounded-2xl flex items-center justify-center overflow-hidden">
                                        <UserIcon size={64} className="text-stone-500 opacity-50" />
                                    </div>
                                </div>
                                <div className="text-center xl:text-left space-y-1">
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
                                        {user.bio || "No bio set."}
                                    </p>
                                </div>
                                
                                <div className="glass-panel p-6 rounded-3xl">
                                    <h3 className="text-lg font-bold text-moss mb-3 uppercase tracking-wide">Tune of the Day</h3>
                                    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl">
                                        <div className="w-10 h-10 bg-clay rounded-full flex items-center justify-center text-bark shadow-lg">
                                            <Play size={16} fill="currentColor" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                                                <div className="h-full w-1/2 bg-clay animate-pulse"></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-mono opacity-70">
                                                <span>TRACK_02.MP3</span>
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
                                Crew <span className="text-sm font-normal text-sand opacity-50 ml-2">(12)</span>
                            </h3>
                            <div className={`grid gap-4 ${isFeedExpanded ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'}`}>
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
