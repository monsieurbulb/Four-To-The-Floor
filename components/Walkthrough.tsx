
import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Check, Radio, User, ShoppingBag, Zap } from 'lucide-react';

interface WalkthroughProps {
  onClose: () => void;
  onNavigate: (view: 'stream' | 'profile' | 'shop') => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to Four To The Floor",
    description: "You have entered the definitive archive for Drum & Bass culture. This platform connects the underground through live streams, digital assets, and community vibes.",
    icon: <Radio size={32} className="text-moss" />,
    view: 'stream' as const,
    highlight: 'Main Player'
  },
  {
    title: "The Live Stream",
    description: "This is your window to the world. Watch live sets, interact with the stream using reactions, and earn points just for being locked in.",
    icon: <Radio size={32} className="text-clay" />,
    view: 'stream' as const,
    highlight: 'Video Player'
  },
  {
    title: "Your Identity",
    description: "Your profile is your digital passport. Manage your wallet, view your purchase history, and customize your public MySpace-style page.",
    icon: <User size={32} className="text-sand" />,
    view: 'profile' as const,
    highlight: 'Profile Section'
  },
  {
    title: "The Drop (Shop)",
    description: "Spend your hard-earned points or cash on limited edition Asset Packs. Buy emojis to use in the live chat and reacting to the stream.",
    icon: <ShoppingBag size={32} className="text-moss" />,
    view: 'shop' as const,
    highlight: 'Shop'
  },
  {
    title: "Earn Rewards",
    description: "Look for the Subscribe button on the player. Subscribing and chatting earns you PTS (Points) which you can redeem for exclusive content.",
    icon: <Zap size={32} className="text-yellow-500" />,
    view: 'stream' as const,
    highlight: 'Rewards'
  }
];

export const Walkthrough: React.FC<WalkthroughProps> = ({ onClose, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Sync the app view with the current step
  useEffect(() => {
    if (isVisible) {
        onNavigate(TOUR_STEPS[currentStep].view);
    }
  }, [currentStep, isVisible, onNavigate]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Allow animation to finish
  };

  if (!isVisible) return null;

  const stepData = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bark/80 backdrop-blur-sm animate-fadeIn">
      
      {/* Focus Ring Effect (Visual Flourish) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-moss/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-clay/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
      </div>

      <div className="relative w-full max-w-lg mx-6 glass-panel border border-moss/30 rounded-[30px] shadow-2xl overflow-hidden flex flex-col animate-float">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-black/50 flex">
          {TOUR_STEPS.map((_, idx) => (
            <div 
                key={idx} 
                className={`h-full flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-gradient-to-r from-moss to-clay' : 'bg-transparent'}`}
            ></div>
          ))}
        </div>

        <div className="p-8 md:p-10 text-center flex flex-col items-center">
            
            <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                {stepData.icon}
            </div>

            <h2 className="text-3xl font-mono font-bold text-sand mb-4 uppercase tracking-wide">
                {stepData.title}
            </h2>
            
            <p className="text-stone-400 font-sans leading-relaxed mb-8 min-h-[80px]">
                {stepData.description}
            </p>

            <div className="flex w-full gap-4">
                <button 
                    onClick={handleFinish}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-stone-500 font-mono text-xs uppercase hover:bg-white/5 hover:text-sand transition-colors"
                >
                    Skip Tour
                </button>
                <button 
                    onClick={handleNext}
                    className="flex-[2] py-3 rounded-xl bg-moss text-bark font-bold font-mono text-xs uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-moss/20"
                >
                    {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next Step'}
                    {currentStep === TOUR_STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
                </button>
            </div>
        </div>

        {/* Step Indicator */}
        <div className="pb-6 text-center text-[10px] font-mono text-stone-600 uppercase tracking-widest">
            Step {currentStep + 1} of {TOUR_STEPS.length}
        </div>
      </div>
    </div>
  );
};
