import React, { useState } from 'react';
import { FeedItem } from '../types';
import { Plus, X, Film, AlignLeft, Calendar } from 'lucide-react';

interface AdminPanelProps {
  onAddItem: (item: FeedItem) => void;
  onClose: () => void;
  items: FeedItem[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddItem, onClose, items }) => {
  const [title, setTitle] = useState('');
  const [playbackId, setPlaybackId] = useState('');
  const [description, setDescription] = useState('');
  const [series, setSeries] = useState('Series 4');
  const [type, setType] = useState<'video' | 'audio' | 'text' | 'image'>('video');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: FeedItem = {
      id: Date.now().toString(),
      type,
      title,
      content: playbackId ? `https://livepeercdn.studio/hls/${playbackId}/index.m3u8` : description, // Storing URL or text
      livepeerPlaybackId: playbackId || undefined,
      date: new Date().toISOString().split('T')[0],
      series,
      thumbnail: 'https://picsum.photos/600/400?random=' + Date.now(), // Mock thumbnail generator
    };

    onAddItem(newItem);
    setTitle('');
    setPlaybackId('');
    setDescription('');
    alert('Content added to Livepeer Library');
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-bark/95 backdrop-blur-xl text-sand font-sans overflow-hidden">
        
        {/* Left: Form */}
        <div className="w-full md:w-1/3 p-8 border-r border-white/5 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-mono font-bold text-moss">CMS // ADMIN</h1>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-xs font-mono text-stone-500 mb-2 block uppercase">Content Type</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['video', 'audio', 'text', 'image'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t as any)}
                                className={`py-2 rounded-xl text-xs font-mono uppercase border border-white/5 transition-all ${type === t ? 'bg-moss text-bark font-bold' : 'bg-black/20 text-stone-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-mono text-stone-500 mb-2 block uppercase">Title</label>
                    <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
                        <AlignLeft size={16} className="text-stone-500 mr-3" />
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-transparent w-full focus:outline-none text-sm"
                            placeholder="Enter content title..."
                        />
                    </div>
                </div>

                {type === 'video' && (
                    <div>
                        <label className="text-xs font-mono text-moss mb-2 block uppercase">Livepeer Playback ID</label>
                        <div className="flex items-center bg-black/20 border border-moss/30 rounded-2xl px-4 py-3">
                            <Film size={16} className="text-moss mr-3" />
                            <input 
                                value={playbackId}
                                onChange={(e) => setPlaybackId(e.target.value)}
                                className="bg-transparent w-full focus:outline-none text-sm font-mono text-moss"
                                placeholder="e.g. 8b3bdq..."
                            />
                        </div>
                        <p className="text-[10px] text-stone-500 mt-2 font-mono">
                            Paste the ID from Livepeer Studio. The system will generate the HLS URL automatically.
                        </p>
                    </div>
                )}

                {(type === 'text' || type === 'image') && (
                    <div>
                        <label className="text-xs font-mono text-stone-500 mb-2 block uppercase">Content / URL</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 min-h-[100px] focus:outline-none text-sm"
                            placeholder="Enter text body or Image URL..."
                        />
                    </div>
                )}

                <div>
                    <label className="text-xs font-mono text-stone-500 mb-2 block uppercase">Series Tag</label>
                    <input 
                        value={series}
                        onChange={(e) => setSeries(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none text-sm font-mono"
                    />
                </div>

                <button type="submit" className="w-full py-4 bg-sand text-bark font-bold rounded-full hover:bg-moss transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Add to Library
                </button>
            </form>
        </div>

        {/* Right: Preview List */}
        <div className="flex-1 bg-black/20 p-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-mono font-bold text-stone-400 mb-6 uppercase">Current Archive Library ({items.length})</h2>
            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-moss/50 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
                            <span className="text-xs font-mono text-stone-500 uppercase">{item.type.substring(0,3)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sand truncate">{item.title}</h3>
                            <p className="text-xs text-stone-500 font-mono truncate">
                                {item.livepeerPlaybackId ? `ID: ${item.livepeerPlaybackId}` : item.series}
                            </p>
                        </div>
                        <div className="text-xs font-mono text-stone-600 px-3 py-1 bg-black/20 rounded-full">
                            {item.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};