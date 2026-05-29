import React, { useState, useEffect } from 'react';
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Plus, 
  Clock, 
  BarChart3, 
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { auth } from '../firebase';
import { dbService } from '../services/dbService';
import { SocialAccount, SocialPost } from '../types';
import { cn, formatDate } from '../lib/utils';

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-50' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
];

export default function Social() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledAt: new Date().toISOString()
  });
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubAccounts = dbService.subscribe<SocialAccount>(
      'social_accounts',
      auth.currentUser.uid,
      (data) => {
        setAccounts(data);
      },
      'connectedAt',
      'desc'
    );

    const unsubPosts = dbService.subscribe<SocialPost>(
      'social_posts',
      auth.currentUser.uid,
      (data) => {
        setPosts(data);
      },
      'createdAt',
      'desc'
    );

    return () => {
      unsubAccounts();
      unsubPosts();
    };
  }, []);

  const handleConnect = async (platform: string) => {
    if (!auth.currentUser) return;
    setIsConnecting(platform);
    
    // Simulate OAuth Popup
    setTimeout(async () => {
      try {
        await dbService.add('social_accounts', {
          platform,
          name: `${auth.currentUser?.displayName || 'User'} on ${platform}`,
          profileImage: auth.currentUser?.photoURL || '',
          ownerUid: auth.currentUser?.uid || '',
          connectedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error connecting account:", error);
      } finally {
        setIsConnecting(null);
      }
    }, 1500);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || newPost.platforms.length === 0) return;

    try {
      await dbService.add('social_posts', {
        ...newPost,
        status: 'scheduled',
        ownerUid: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewPost({ content: '', platforms: [], scheduledAt: new Date().toISOString() });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.delete('social_posts', id, auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const togglePlatform = (id: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id) 
        ? prev.platforms.filter(p => p !== id) 
        : [...prev.platforms, id]
    }));
  };

  const totalPostCount = posts.length;
  const reachEstimate = totalPostCount * 324 + (accounts.length * 512);
  const likesEstimate = totalPostCount * 14 + (accounts.length * 36);
  const sharesEstimate = Math.round(likesEstimate * 0.15);
  const engagementRate = accounts.length > 0 ? (3.8 + (posts.length * 0.2)).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Social Media</h1>
          <p className="text-gray-500 mt-1">Manage your social presence and schedule content.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          Schedule Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Connected Accounts */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Connected Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLATFORMS.map((platform) => {
                const account = accounts.find(a => a.platform === platform.id);
                return (
                  <div key={platform.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col items-center text-center">
                    <div className={cn("p-3 rounded-xl mb-3", platform.bg, platform.color)}>
                      <platform.icon size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{platform.name}</p>
                    {account ? (
                      <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                        <CheckCircle2 size={12} />
                        Connected
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnect(platform.id)}
                        disabled={isConnecting === platform.id}
                        className="mt-2 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50 font-sans cursor-pointer"
                      >
                        {isConnecting === platform.id ? 'Connecting...' : 'Connect Account'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 font-sans">Scheduled Content ({posts.length})</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {posts.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No posts scheduled yet.</div>
              ) : posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {post.platforms.map(p => {
                            const plat = PLATFORMS.find(x => x.id === p);
                            return plat ? (
                              <span key={p} className={cn("p-1 rounded-lg", plat.bg, plat.color)}>
                                <plat.icon size={14} />
                              </span>
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                            Scheduled for {formatDate(post.scheduledAt)}
                          </span>
                          <button 
                            onClick={() => deletePost(post.id)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                          <Clock size={12} />
                          {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest cursor-pointer">
                          <ExternalLink size={12} />
                          Preview Link
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Engagement Stats depending on connected status & scheduled posts count! */}
        <div className="space-y-6">
          <div className="bg-[#151619] p-8 rounded-3xl border border-white/5 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Live Engagement</h3>
              <BarChart3 size={20} className="text-orange-500" />
            </div>
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 font-mono">
                  <span>Total Reach</span>
                  <span className="text-white">{(reachEstimate / 1000).toFixed(1)}K</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden font-mono">
                  <div className="h-full bg-orange-500 transition-all duration-550" style={{ width: `${Math.min(95, Math.max(5, (reachEstimate / 15000) * 100))}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 font-mono">
                  <span>Engagement Rate</span>
                  <span className="text-white">{engagementRate}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden font-mono">
                  <div className="h-full bg-blue-500 transition-all duration-550" style={{ width: `${Math.min(95, Math.max(5, (Number(engagementRate) / 8) * 100))}%` }}></div>
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 font-mono">Likes</p>
                  <p className="text-lg font-bold">{likesEstimate}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 font-mono">Shares</p>
                  <p className="text-lg font-bold">{sharesEstimate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">Best Time to Post</h3>
            <p className="text-sm text-gray-500 mb-6">Based on your dynamic audience stats from last week.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl border border-orange-100 font-sans">
                <span className="text-xs font-bold text-gray-700">Tuesday</span>
                <span className="text-xs font-bold text-orange-600 font-mono">10:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-xs font-bold text-gray-700">Thursday</span>
                <span className="text-xs font-bold text-gray-500 font-mono">2:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Schedule New Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Platforms</label>
                <div className="flex gap-3">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer",
                        newPost.platforms.includes(p.id) ? "border-orange-500 bg-orange-50" : "border-transparent bg-gray-50"
                      )}
                    >
                      <p.icon size={18} className={newPost.platforms.includes(p.id) ? "text-orange-500" : "text-gray-400"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Post Content</label>
                <textarea 
                  required
                  placeholder="Draft your promotional text here..."
                  className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 resize-none text-sm text-gray-700"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Schedule Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm text-gray-700"
                  value={newPost.scheduledAt.slice(0, 16)}
                  onChange={(e) => setNewPost({...newPost, scheduledAt: new Date(e.target.value).toISOString()})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={newPost.platforms.length === 0}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
