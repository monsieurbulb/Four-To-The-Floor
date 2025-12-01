
import React, { useState } from 'react';
import { Product, User } from '../types';
import { ShoppingBag, Zap, CreditCard, X, Package, Check } from 'lucide-react';

interface ShopProps {
    user: User;
    onPurchase: (product: Product, currency: 'cash' | 'points') => void;
    onClose: () => void;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Rave Starter Pack',
        description: '5x Fire, 5x Rewind. Essential reactions.',
        priceCash: 4.99,
        pricePoints: 500,
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop',
        assets: [
            { id: 'e1', type: 'emoji', name: 'Fire', icon: '🔥', quantity: 5 },
            { id: 'e2', type: 'emoji', name: 'Rewind', icon: '⏪', quantity: 5 },
        ]
    },
    {
        id: 'p2',
        name: 'Junglist Massive',
        description: '10x Lighter, 10x Gunfinger. Proper heavy.',
        priceCash: 8.99,
        pricePoints: 1200,
        image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
        assets: [
            { id: 'e3', type: 'emoji', name: 'Lighter', icon: '🕯️', quantity: 10 },
            { id: 'e4', type: 'emoji', name: 'Gunfinger', icon: '👆', quantity: 10 },
        ]
    },
    {
        id: 'p3',
        name: 'Vibes Only',
        description: 'Limited edition "Wave" reaction.',
        priceCash: 2.99,
        pricePoints: 300,
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e27ab?q=80&w=2074&auto=format&fit=crop',
        assets: [
            { id: 'e5', type: 'emoji', name: 'Wave', icon: '🌊', quantity: 10 },
        ]
    }
];

export const Shop: React.FC<ShopProps> = ({ user, onPurchase, onClose }) => {
    return (
        <div className="w-full h-full bg-bark/95 backdrop-blur-xl flex flex-col font-sans animate-fadeIn relative">
            
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-moss rounded-full flex items-center justify-center text-bark shadow-lg shadow-moss/20">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-mono text-sand">THE DROP</h1>
                        <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">Digital Asset Store</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    {/* User Balance Display */}
                    <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/5">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-stone-500 uppercase tracking-widest">Wallet</span>
                            <span className="text-sand font-mono font-bold">£{user.walletBalance.toFixed(2)}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-stone-500 uppercase tracking-widest">Points</span>
                            <span className="text-moss font-mono font-bold flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> {user.points}
                            </span>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-stone-400">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_PRODUCTS.map(product => (
                        <div key={product.id} className="bg-white/5 border border-white/5 rounded-[30px] overflow-hidden hover:border-moss/30 transition-all duration-300 group flex flex-col">
                            {/* Image */}
                            <div className="h-48 bg-black/50 relative overflow-hidden">
                                <img src={product.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono uppercase text-sand">
                                    Emoji Pack
                                </div>
                            </div>
                            
                            {/* Details */}
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold font-mono text-sand mb-2">{product.name}</h3>
                                <p className="text-sm text-stone-400 mb-6 flex-1">{product.description}</p>
                                
                                <div className="space-y-3">
                                    {/* Pay with Points */}
                                    <button 
                                        onClick={() => onPurchase(product, 'points')}
                                        disabled={user.points < (product.pricePoints || 99999)}
                                        className={`w-full py-3 rounded-xl font-bold font-mono uppercase text-sm flex items-center justify-center gap-2 transition-colors border
                                            ${user.points >= (product.pricePoints || 0)
                                                ? 'bg-moss/10 border-moss/50 text-moss hover:bg-moss hover:text-bark'
                                                : 'bg-black/20 border-white/5 text-stone-600 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <Zap size={14} />
                                        <span>Redeem {product.pricePoints} PTS</span>
                                    </button>

                                    {/* Pay with Cash */}
                                    <button 
                                        onClick={() => onPurchase(product, 'cash')}
                                        disabled={user.walletBalance < (product.priceCash || 99999)}
                                        className={`w-full py-3 rounded-xl font-bold font-mono uppercase text-sm flex items-center justify-center gap-2 transition-colors border
                                            ${user.walletBalance >= (product.priceCash || 0)
                                                ? 'bg-sand/10 border-sand/50 text-sand hover:bg-sand hover:text-bark'
                                                : 'bg-black/20 border-white/5 text-stone-600 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <CreditCard size={14} />
                                        <span>Buy £{product.priceCash?.toFixed(2)}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
