import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Trello, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Share2,
  Printer
} from 'lucide-react';
import { auth, signIn, signInAsGuest, logOut, onAuthChange, type AuthUser } from './firebase';
import { cn } from './lib/utils';

// Components (will be created next)
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Pipelines from './components/Pipelines';
import AIContent from './components/AIContent';
import Communication from './components/Communication';
import Social from './components/Social';
import BrandCenter from './components/BrandCenter';

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Pipelines', path: '/pipelines', icon: Trello },
    { name: 'AI Content', path: '/ai-content', icon: Sparkles },
    { name: 'Social Media', path: '/social', icon: Share2 },
    { name: 'Communication', path: '/communication', icon: MessageSquare },
    { name: 'Brand Center', path: '/brand-center', icon: Printer },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-[#151619] text-white w-64 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">N</div>
            <span className="text-xl font-bold tracking-tight">Nexus CRM</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-white"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/5">
          <button 
            onClick={logOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ setIsSidebarOpen }: { setIsSidebarOpen: (val: boolean) => void }) {
  const user = auth.currentUser;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl w-64 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.displayName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} 
            alt="Profile" 
            className="w-10 h-10 rounded-xl object-cover border-2 border-orange-500/10"
          />
        </div>
      </div>
    </header>
  );
}

function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn();
    } catch (err: any) {
      console.error("Google login failed inside iframe:", err);
      setError(
        "Google Sign-In was blocked, cancelled, or not authorized for this domain. Use 'Sign In with Local Admin' to enter the CRM now, then fix Firebase authorized domains when ready."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAsGuest();
    } catch (err: any) {
      console.error("Sandbox login failed:", err);
      setError(err?.message || "Could not spin up guest sandbox account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 flex-col">
      <div className="max-w-md w-full space-y-8 bg-[#151619] p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center w-full">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-6 shadow-lg shadow-orange-500/20">N</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Nexus</h2>
          <p className="mt-2 text-gray-400">The next generation CRM for modern teams.</p>
        </div>

        {error && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl text-xs leading-relaxed space-y-1">
            <p className="font-bold">Notice:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-150 transition-all font-sans transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 shrink-0" />
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-xs font-bold font-mono tracking-wider text-gray-600 uppercase">OR LOCAL ACCESS</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            onClick={handleSandboxSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all font-sans shadow-lg shadow-orange-500/15 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>Sign In with Local Admin</span>
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 leading-normal">
          By continuing, you agree to our Terms of Service and Privacy Policy. Local admin mode keeps the CRM usable even when Firebase or Google OAuth is not configured yet.
        </p>

        <div className="pt-4 border-t border-white/5">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full text-center text-xs font-bold font-mono tracking-wider text-[#C49A6C] hover:underline uppercase cursor-pointer"
          >
            {showConfig ? 'Hide Authorized OAuth Settings' : 'Show Authorized OAuth Settings (Redirect/Origins)'}
          </button>

          {showConfig && (
            <div className="mt-4 p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3 text-[11px] text-gray-300 font-mono leading-relaxed text-left">
              <div className="space-y-1">
                <span className="text-[#C49A6C] font-bold uppercase tracking-wider text-[9px]">Authorized Redirect URI:</span>
                <input 
                  type="text" 
                  readOnly 
                  value="https://composed-amulet-479803-p9.firebaseapp.com/__/auth/handler" 
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-1.5 text-[10px] text-[#C49A6C] outline-none select-all"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[#C49A6C] font-bold uppercase tracking-wider text-[9px]">Authorized JS Origins:</span>
                <input 
                  type="text" 
                  readOnly 
                  value="https://composed-amulet-479803-p9.firebaseapp.com" 
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-1.5 text-[10px] text-[#C49A6C] outline-none select-all"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[#C49A6C] font-bold uppercase tracking-wider text-[9px]">App iFrame Host Origins:</span>
                <input 
                  type="text" 
                  readOnly 
                  value="https://ais-dev-3uhvflfdf25u7bjng6hag6-27160861664.us-east5.run.app" 
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-1.5 text-[10px] text-gray-300 outline-none select-all mb-1"
                />
                <input 
                  type="text" 
                  readOnly 
                  value="https://ais-pre-3uhvflfdf25u7bjng6hag6-27160861664.us-east5.run.app" 
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-1.5 text-[10px] text-gray-300 outline-none select-all"
                />
              </div>
              <p className="text-[9px] text-gray-400 capitalize-none leading-normal">
                Paste these into your Google Cloud APIs & Services Credentials and Firebase Authentication Google provider properties to resolve any redirect or authorization blockage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa] flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/ai-content" element={<AIContent />} />
              <Route path="/social" element={<Social />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/brand-center" element={<BrandCenter />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
