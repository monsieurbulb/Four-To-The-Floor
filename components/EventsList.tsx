import React from 'react';
import { Event, User } from '../types';
import { Calendar, Bell, Check, MapPin } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  user: User;
  onToggleSubscribe: (eventId: string) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ events, user, onToggleSubscribe }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
         <div>
           <h1 className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-acid to-rave mb-2">TRANSMISSION SCHEDULE</h1>
           <p className="text-gray-400 font-mono text-sm tracking-widest">UPCOMING LIVE SIGNALS</p>
         </div>
         <div className="hidden md:block text-right">
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-xs text-gray-500 uppercase">Incoming Streams</div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => {
          const isSubscribed = user.subscribedEventIds?.includes(event.id);
          
          return (
            <div key={event.id} className="group relative bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-acid/50 transition-all duration-300">
               <div className="absolute inset-0 bg-gradient-to-r from-acid/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               
               <div className="flex flex-col md:flex-row">
                  {/* Date Date Date */}
                  <div className="md:w-48 bg-black/50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-white/10">
                     <span className="text-sm font-mono text-acid mb-1 uppercase">{event.time}</span>
                     <span className="text-5xl font-bold tracking-tighter text-white">{new Date(event.date).getDate()}</span>
                     <span className="text-xl font-bold uppercase text-gray-500">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                     <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2 group-hover:text-acid transition-colors">{event.title}</h2>
                          <p className="text-gray-400 text-sm mb-4 max-w-xl">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                             {event.lineup.map((artist, i) => (
                               <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300">
                                 {artist}
                               </span>
                             ))}
                          </div>
                        </div>

                        {/* Image for desktop */}
                        <div className="hidden lg:block w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                           <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                     </div>
                  </div>

                  {/* Action */}
                  <div className="p-6 flex items-center justify-center md:border-l border-white/10 bg-black/20">
                     <button 
                       onClick={() => onToggleSubscribe(event.id)}
                       className={`
                         w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300
                         ${isSubscribed 
                           ? 'bg-rave text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]' 
                           : 'bg-white text-black hover:bg-acid hover:scale-105'
                         }
                       `}
                     >
                        {isSubscribed ? (
                          <>
                            <Check size={18} />
                            <span>LOCKED IN</span>
                          </>
                        ) : (
                          <>
                            <Bell size={18} />
                            <span>REMIND ME</span>
                          </>
                        )}
                     </button>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};