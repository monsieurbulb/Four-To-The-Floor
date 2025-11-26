import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Send, CornerDownLeft } from 'lucide-react';

interface ChatProps {
  user: User;
}

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
}

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', username: 'System', text: 'Peace and vibes only.', timestamp: new Date(), isSystem: true },
    { id: '2', username: 'Flora', text: 'This set is blooming lovely.', timestamp: new Date() },
    { id: '3', username: 'RootDown', text: 'Can we get a rewind?', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      username: user.username,
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
         <span className="font-mono text-xs text-moss tracking-widest uppercase">Community Chat</span>
         <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-moss/80"></div>
            <div className="w-2 h-2 rounded-full bg-clay/80"></div>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center opacity-70' : 'items-start'}`}>
            {!msg.isSystem && (
              <span className="text-[10px] text-stone-400 font-mono mb-1 ml-2">
                {msg.username}
              </span>
            )}
            <div 
              className={`
                px-4 py-2.5 text-sm max-w-[90%] font-mono break-words rounded-2xl
                ${msg.isSystem 
                  ? 'text-moss border border-moss/20 bg-moss/5 text-xs uppercase tracking-wider rounded-full' 
                  : 'bg-white/5 text-sand rounded-tl-none'
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
        <div className="relative flex-1">
           <input
             type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             placeholder="Share your thoughts..."
             className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-3 text-sm font-mono text-sand focus:outline-none focus:border-moss transition-colors"
           />
        </div>
        <button 
          type="submit" 
          className="bg-sand text-bark hover:bg-moss w-10 h-10 rounded-full transition-colors flex items-center justify-center shadow-lg"
        >
          <CornerDownLeft size={16} />
        </button>
      </form>
    </div>
  );
};