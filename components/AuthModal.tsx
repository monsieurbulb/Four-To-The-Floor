
import React, { useState, useEffect } from 'react';
import { User, DEFAULT_STYLE } from '../types';
import { Loader2, Key, ArrowRight, User as UserIcon, Mail } from 'lucide-react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

interface AuthModalProps {
  onLogin: (user: User) => void;
}

// Client ID for demonstration purposes.
const CLIENT_ID = "BPi5PB_Ui16knsMEubloBcBPG46cd_kTcs819BBFnQS6gS8P_wuyWwF6gY1i4aapaITz8+x+Lw3Y9cc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia Testnet
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3authInstance = new Web3Auth({
          clientId: CLIENT_ID,
          web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
          privateKeyProvider,
          uiConfig: {
            appName: "Four To The Floor",
            mode: "dark",
            theme: {
              primary: "#2dd4bf", 
            },
            defaultLanguage: "en",
          }
        });

        const openloginAdapterConfig = {
            [WALLET_ADAPTERS.OPENLOGIN]: {
                label: "Social Login",
                loginMethods: {
                    google: { name: "Google", showOnModal: true },
                    facebook: { name: "Facebook", showOnModal: false },
                },
            },
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                showOnModal: true,
                label: "WalletConnect" 
            },
            [WALLET_ADAPTERS.METAMASK]: {
                showOnModal: true,
                label: "Talisman / Metamask" 
            }
        };

        setWeb3auth(web3authInstance);
        await web3authInstance.initModal({
             modalConfig: openloginAdapterConfig as any
        });
        setReady(true);

        // Auto-login if session exists
        if (web3authInstance.connected) {
          await getUserInfo(web3authInstance);
        }
      } catch (error: any) {
        console.warn("Web3Auth Init Warning:", error);
        setReady(true); // Allow fallback
      }
    };

    init();

    // Fallback timer
    timer = setTimeout(() => {
        if (!ready) {
            setReady(true);
        }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const getUserInfo = async (web3authInstance: Web3Auth) => {
    try {
      const userInfo = await web3authInstance.getUserInfo();
      
      let address = "";
      if (web3authInstance.provider) {
        const accounts = await web3authInstance.provider.request({ 
          method: "eth_accounts" 
        }) as string[];
        
        if (accounts && accounts.length > 0) {
          address = accounts[0];
        }
      }
      
      // Use form data if available, otherwise fallback to Web3Auth info
      const finalUsername = username || userInfo.name || "Anonymous";
      const finalEmail = email || userInfo.email || "";
      
      const isAdmin = finalUsername.toLowerCase().includes("admin") || 
                      finalUsername.toLowerCase().includes("core");

      const user: User = {
        id: userInfo.verifierId || Date.now().toString(),
        username: finalUsername,
        email: finalEmail,
        walletBalance: 0,
        points: 0, 
        walletAddress: address, 
        bio: `Member since ${new Date().getFullYear()}.`,
        profileStyle: DEFAULT_STYLE,
        following: [],
        subscribedEventIds: [],
        isAdmin: isAdmin,
        profileImage: userInfo.profileImage,
      };
      
      onLogin(user);
    } catch (e) {
      console.error("Error fetching user info:", e);
      setError("Failed to retrieve user details.");
    }
  };

  const login = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username || !email) {
        setError("Please identify yourself.");
        return;
    }

    if (!web3auth) {
      console.log("Using fallback login (Guest)");
      loginGuest();
      return;
    }

    if (!ready) return;

    setLoading(true);
    try {
      await web3auth.connect();
      await getUserInfo(web3auth);
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error?.message?.includes("User closed")) {
          setLoading(false);
      } else {
          loginGuest();
      }
    } finally {
      setLoading(false);
    }
  };

  const loginGuest = () => {
      const guestUser: User = {
          id: 'guest-' + Date.now(),
          username: username || 'New Initiate',
          email: email || 'guest@fttf.local',
          walletBalance: 0,
          points: 100,
          walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          bio: 'Guest account. Simulation mode.',
          profileStyle: DEFAULT_STYLE,
          following: [],
          subscribedEventIds: [],
          isAdmin: false, 
      };
      onLogin(guestUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-bark flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Mystical Background Layers */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-moss/5 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-clay/5 rounded-full blur-[80px] animate-blob"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* GRAPHIC MOTIF: The Portal */}
        <div className="mb-8 relative w-32 h-32 flex items-center justify-center">
           <div className="absolute inset-0 border-[1px] border-moss/30 rounded-full animate-spin-slow"></div>
           <div className="absolute inset-4 border-[1px] border-transparent border-t-moss/50 border-b-clay/50 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
           <div className="absolute w-2 h-2 bg-sand rounded-full blur-sm animate-pulse"></div>
        </div>

        {/* Text Heading */}
        <h2 className="text-2xl md:text-3xl font-bold font-mono tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-sand via-moss to-sand mb-8 text-center uppercase animate-float">
           Join The Movement
        </h2>

        {/* Login Form */}
        <form onSubmit={login} className="w-full space-y-4 relative animate-fadeIn">
            
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-moss to-clay opacity-0 group-hover:opacity-20 blur transition-opacity rounded-xl"></div>
                <div className="relative bg-black/40 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-moss/50 transition-colors">
                    <UserIcon size={18} className="text-stone-500 mr-3" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Create Username"
                        className="bg-transparent w-full text-sand placeholder-stone-600 outline-none font-mono text-sm tracking-wider"
                        required
                    />
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-moss to-clay opacity-0 group-hover:opacity-20 blur transition-opacity rounded-xl"></div>
                <div className="relative bg-black/40 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-moss/50 transition-colors">
                    <Mail size={18} className="text-stone-500 mr-3" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="bg-transparent w-full text-sand placeholder-stone-600 outline-none font-mono text-sm tracking-wider"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={!ready && !error}
                className="w-full bg-sand hover:bg-moss text-bark font-bold py-4 rounded-xl mt-6 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg group hover:scale-[1.02]"
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <span>Initialize</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
            
            {error && (
                <div className="text-center text-clay text-[10px] font-mono uppercase tracking-widest mt-4">
                    {error}
                </div>
            )}
        </form>

      </div>

      <div className="absolute bottom-8 w-full flex justify-between px-8 text-[10px] text-stone-700 font-mono uppercase tracking-widest z-20">
         <span>Est. 2024 London</span>
         
         <button 
           onClick={loginGuest} 
           className="opacity-20 hover:opacity-100 hover:text-moss transition-opacity"
           title="Simulate Access"
         >
           <Key size={14} />
         </button>
      </div>

    </div>
  );
};
