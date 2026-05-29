import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Mail, 
  Share2, 
  FileText, 
  Layout,
  History,
  Trash2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { dbService } from '../services/dbService';
import { generateMarketingContent } from '../services/gemini';
import { AIContent as AIContentType } from '../types';
import { cn, formatDate } from '../lib/utils';

const CONTENT_TYPES = [
  { id: 'email', name: 'Email Campaign', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'template', name: 'Email Template', icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'social', name: 'Social Media', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'blog', name: 'Blog Post', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'ad', name: 'Ad Copy', icon: Layout, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const EMAIL_TEMPLATES = [
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'promotion', name: 'Promotion' },
  { id: 'follow-up', name: 'Follow-up' },
];

const CATEGORIES = [
  'Product Launch',
  'Customer Testimonial',
  'Seasonal Promotion',
  'Brand Awareness',
  'Re-engagement',
  'Other'
];

export default function AIContent() {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('email');
  const [selectedTemplateType, setSelectedTemplateType] = useState('newsletter');
  const [selectedCategory, setSelectedCategory] = useState('Product Launch');
  const [filterCategory, setFilterCategory] = useState('All');
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<AIContentType[]>([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = dbService.subscribe<AIContentType>(
      'contents', 
      auth.currentUser.uid, 
      (data) => {
        setHistory(data);
      },
      'createdAt',
      'desc'
    );

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !auth.currentUser) return;

    setErrorMessage('');
    setIsGenerating(true);
    try {
      const contentType = selectedType === 'template' 
        ? `${selectedTemplateType} email template` 
        : selectedType;
        
      const text = await generateMarketingContent(prompt, contentType);
      setResult(text || '');
      
      await dbService.add('contents', {
        prompt,
        result: text || '',
        type: selectedType === 'template' ? `template:${selectedTemplateType}` : selectedType,
        category: selectedCategory,
        ownerUid: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Content generation failed.';
      setErrorMessage(message);
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.delete('contents', id, auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleScheduleSocial = async () => {
    if (!result || !auth.currentUser) return;
    
    try {
      await dbService.add('social_posts', {
        content: result,
        platforms: ['twitter'], // Default to twitter for now
        status: 'draft',
        ownerUid: auth.currentUser.uid,
        scheduledAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        createdAt: new Date().toISOString()
      });
      navigate('/social');
    } catch (error) {
      console.error("Error scheduling social post:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Content Engine</h1>
        <p className="text-gray-500 mt-1">Generate high-converting marketing materials in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    selectedType === type.id 
                       ? "border-orange-500 bg-orange-50/50" 
                      : "border-transparent bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className={cn("p-2 rounded-xl", type.bg, type.color)}>
                    <type.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 text-center">{type.name}</span>
                </button>
              ))}
            </div>

            {selectedType === 'template' && (
              <div className="flex flex-wrap gap-2 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest w-full mb-2">Select Template Type</span>
                {EMAIL_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateType(t.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      selectedTemplateType === t.id
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-white text-indigo-600 hover:bg-indigo-50"
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">What are you promoting?</label>
              <textarea 
                placeholder="e.g. A summer sale for our new eco-friendly sneakers with 20% off..."
                className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 resize-none text-sm text-gray-700"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Sparkles size={20} />
              )}
              {isGenerating ? 'Generating Magic...' : 'Generate Content'}
            </button>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs leading-relaxed">
                {errorMessage}
              </div>
            )}
          </div>

          {result && (
            <div className="bg-[#151619] text-white p-8 rounded-3xl border border-white/5 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Generated Result</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleScheduleSocial}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-xs font-bold text-white cursor-pointer"
                  >
                    <Calendar size={16} className="text-orange-500" />
                    Schedule Post
                  </button>
                  <button 
                    onClick={() => copyToClipboard(result)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white cursor-pointer"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 leading-relaxed text-sm font-sans">
                {result}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">Recent History</h3>
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-bold bg-gray-50 border-none rounded-lg px-2 py-1 focus:ring-0 text-gray-600"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {history
              .filter(item => filterCategory === 'All' || item.category === filterCategory)
              .length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No content history found.</p>
            ) : history
                .filter(item => filterCategory === 'All' || item.category === filterCategory)
                .map((item) => (
              <div key={item.id} className="group p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer" onClick={() => setResult(item.result)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-mono">
                      {item.type}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(item.id);
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.prompt}</p>
                <p className="text-[10px] text-gray-400 font-mono">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
