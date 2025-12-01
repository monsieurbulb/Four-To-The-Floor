
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

interface HelpAgentProps {
  username: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  'wallet': "Your wallet holds your balance (£) and Points. You can top it up, send funds to other users using their address, or receive funds via your QR code.",
  'points': "PTS (Points) are earned by subscribing to the stream, chatting, and attending events. You can spend them in the Shop on exclusive emoji packs.",
  'shop': "The Drop (Shop) is where you buy Asset Packs. These include emojis and reactions to use during the live stream.",
  'emoji': "Emojis are 'Assets' in your inventory. You start with none. Visit the Shop to buy packs like the 'Rave Starter Pack' to get Fire and Rewind reactions.",
  'stream': "The Live Stream is powered by Livepeer. If it's lagging, try refreshing. You can interact using the reaction bar at the bottom if you have assets.",
  'admin': "Admin access is restricted to the Core Team. If you have a key, use the Shield icon in the bottom right to access the CMS.",
  'profile': "Your profile has two sides: Private (Account/Wallet) and Public (Myspace-style). You can customize your public look in the settings.",
  'upload': "To upload content, you must be an Admin. Use the CMS console to add Livepeer Playback IDs for video or image URLs.",
  'james': "That's me! I'm James, your virtual guide to the underground. I'm running on a neural net trained on 90s rave flyers and basslines.",
  'hello': "Safe! Good to see you. How can I help you navigate the platform today?",
  'hi': "Yo! Welcome to Four To The Floor. Need a hand?",
};

export const HelpAgent: React.FC<HelpAgentProps> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', sender: 'agent', text: `Yo ${username}. I'm James. Need help with the site?` }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Simple keyword matching
    const match = Object.keys(KNOWLEDGE_BASE).find(key => lowerQuery.includes(key));
    
    if (match) {
      return KNOWLEDGE_BASE[match];
    }
    
    return "I'm not sure about that one. Try asking about 'Wallet', 'Points', 'Shop', or 'Stream'.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking delay
    setTimeout(() => {
        const responseText = generateResponse(userMsg.text);
        const agentMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'agent', text: responseText };
        setMessages(prev => [...prev, agentMsg]);
    }, 800);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[90] flex flex-col items-end pointer-events-auto font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 glass-panel bg-bark/90 rounded-[30px] border border-moss/30 shadow-2xl flex flex-col overflow-hidden animate-float-up origin-bottom-right">
           
           {/* Header */}
           <div className="p-4 border-b border-white/5 bg-moss/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center text-bark shadow-lg">
                    <Bot size={18} />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold font-mono text-sand">JAMES_AI</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-moss uppercase tracking-wider">Online</span>
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-sand transition-colors">
                 <X size={18} />
              </button>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                          max-w-[85%] px-3 py-2 text-xs leading-relaxed rounded-2xl
                          ${msg.sender === 'user' 
                             ? 'bg-sand text-bark rounded-tr-none font-bold' 
                             : 'bg-black/40 text-stone-300 border border-white/10 rounded-tl-none'
                          }
                      `}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              <div ref={messagesEndRef} />
           </div>

           {/* Input */}
           <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
               <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask for help..."
                  className="flex-1 bg-transparent text-xs text-sand placeholder-stone-600 focus:outline-none font-mono"
               />
               <button type="submit" className="text-moss hover:text-white transition-colors">
                   <Send size={16} />
               </button>
           </form>
        </div>
      )}

      {/* Trigger Button */}
      {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-moss text-bark flex items-center justify-center shadow-lg shadow-moss/20 hover:scale-110 transition-transform hover:bg-white"
            title="Help Agent"
          >
             <Sparkles size={20} />
          </button>
      )}
    </div>
  );
};
