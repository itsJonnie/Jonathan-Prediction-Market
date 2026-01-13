
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  TrendingUp, 
  Wallet, 
  Trophy, 
  Menu, 
  X,
  Home,
  BarChart3,
  Bot
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Markets', page: 'Home', icon: Home },
  { name: 'Create Market', page: 'CreateMarket', icon: TrendingUp },
  { name: 'Portfolio', page: 'Portfolio', icon: Wallet },
  { name: 'Trading Bot', page: 'TradingBot', icon: BarChart3 },
  { name: 'Leaderboard', page: 'Leaderboard', icon: Trophy },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693dad1c864a1653b0942822/1f6fe4557_Predict-X.png';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');
        
        :root {
          --background: 0 0% 0%;
          --foreground: 120 100% 35%;
          --card: 0 0% 5%;
          --card-foreground: 120 100% 35%;
          --popover: 0 0% 5%;
          --popover-foreground: 120 100% 35%;
          --primary: 45 100% 51%;
          --primary-foreground: 0 0% 0%;
          --secondary: 120 100% 25%;
          --secondary-foreground: 0 0% 0%;
          --muted: 0 0% 10%;
          --muted-foreground: 120 100% 25%;
          --accent: 45 100% 51%;
          --accent-foreground: 0 0% 0%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 98%;
          --border: 120 100% 15%;
          --input: 0 0% 10%;
          --ring: 45 100% 51%;
        }
        
        * {
          font-family: 'Orbitron', 'Share Tech Mono', monospace !important;
        }
        
        body {
          background: #000000;
          color: #00ff00;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #1a4d1a;
          border-radius: 0;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #00ff00;
        }
        
        .terminal-glow {
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
        }
        
        .gold-glow {
          text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b-2 border-green-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693dad1c864a1653b0942822/1f6fe4557_Predict-X.png" 
                alt="PredictX Logo" 
                className="h-20 w-auto"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 border-2 border-green-700 bg-black hover:bg-green-950 transition-colors"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-green-500 terminal-glow" />
              ) : (
                <Menu className="h-6 w-6 text-green-500 terminal-glow" />
              )}
            </button>
          </div>
        </div>

        {/* Hamburger Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t-2 border-green-900/50 bg-black"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link 
                      key={item.name} 
                      to={createPageUrl(item.page)}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-all ${
                        isActive 
                          ? 'border-yellow-500 bg-green-950/20 text-yellow-500' 
                          : 'border-green-900/30 text-green-500 hover:border-green-500 hover:bg-green-950/10'
                      }`}>
                        <Icon className="h-5 w-5" />
                        <span className="font-medium tracking-wide">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-4 mt-2 border-t-2 border-green-900/30">
                  <Link to={createPageUrl('Portfolio')} onClick={() => setMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold border-2 border-yellow-400 tracking-wider">
                      <Wallet className="h-4 w-4 mr-2" />
                      EXECUTE TRADE
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-green-900/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693dad1c864a1653b0942822/1f6fe4557_Predict-X.png" 
                alt="PredictX Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-green-600">
              <Link to={createPageUrl('About')} className="hover:text-green-500 terminal-glow transition-colors tracking-wide">ABOUT</Link>
              <a href="#" className="hover:text-green-500 terminal-glow transition-colors tracking-wide">FAQ</a>
              <a href="#" className="hover:text-green-500 terminal-glow transition-colors tracking-wide">TERMS</a>
              <a href="#" className="hover:text-green-500 terminal-glow transition-colors tracking-wide">PRIVACY</a>
            </div>
            <p className="text-sm text-green-700 tracking-wide">© 2026 PREDICTX. MONEY NEVER SLEEPS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
