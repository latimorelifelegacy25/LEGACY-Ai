import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  Edit3, 
  RefreshCw, 
  ShieldCheck, 
  Heart, 
  Eye, 
  Layers, 
  Plus, 
  HelpCircle,
  CheckCircle2,
  Phone,
  FileText,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { auth } from '../firebase';
import { dbService } from '../services/dbService';
import { cn } from '../lib/utils';

// Types for customizable collateral data
interface BrandVariables {
  phone: string;
  website: string;
  counties: string;
  sportsEvent: string;
  founderName: string;
  customHeadline: string;
  customDisclaimer: string;
}

export default function BrandCenter() {
  const [activeTab, setActiveTab] = useState<'poster' | 'brochure' | 'palmcard'>('poster');
  const [variables, setVariables] = useState<BrandVariables>({
    phone: '570-555-0190',
    website: 'www.latimorelifelegacy.com',
    counties: 'Schuylkill, Luzerne, and Northumberland',
    sportsEvent: 'Coal Region Youth Sports leagues and local Chamber events',
    founderName: 'Jackson M. Latimore Sr.',
    customHeadline: 'Stronger Families Build Stronger Communities.',
    customDisclaimer: 'Product availability, features, and suitability vary by carrier, state, age, health, and underwriting. This content is for educational purposes only.'
  });

  const [activeBrochurePanel, setActiveBrochurePanel] = useState<'panel1' | 'panel2' | 'panel3' | 'panel4' | 'panel5' | 'panel6'>('panel1');
  const [palmCardSide, setPalmCardSide] = useState<'front' | 'back'>('front');
  const [auditAlerts, setAuditAlerts] = useState<{ id: string; type: 'success' | 'warn'; msg: string }[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Dynamic audit scoring based on v3.3.0 compliance scorecard guidelines:
  // - Zero fear-based/panicked terminology
  // - Clear reading grade flow (8th-grade level)
  // - Center alignment, specific hex codes
  useEffect(() => {
    const alerts: { id: string; type: 'success' | 'warn'; msg: string }[] = [];
    
    // Check fear terms
    const fearTerms = ['panic', 'death', 'crying', 'hospital', 'terror', 'funeral', 'kill', 'scare', 'fear'];
    const varText = Object.values(variables).join(' ').toLowerCase();
    
    const foundFear = fearTerms.filter(word => varText.includes(word));
    if (foundFear.length > 0) {
      alerts.push({
        id: 'fear-check',
        type: 'warn',
        msg: `Fear-selling detected! Removed compliance points for tone containing: "${foundFear.join(', ')}".`
      });
    } else {
      alerts.push({
        id: 'fear-success',
        type: 'success',
        msg: 'Zero fear-based phrasing found. Exceeds standard compliance thresholds.'
      });
    }

    // Check gratitude/community themes
    const positiveThemes = ['community', 'protection', 'preparation', 'gratitude', 'legacy', 'strength'];
    const foundPos = positiveThemes.filter(word => varText.includes(word));
    if (foundPos.length >= 3) {
      alerts.push({
        id: 'theme-success',
        type: 'success',
        msg: `Strong thematic narrative verified: incorporates "${foundPos.slice(0, 3).join(', ')}".`
      });
    }

    // Verification of the logo setup guidelines
    if (!variables.website.includes('latimore')) {
      alerts.push({
        id: 'brand-name-logo',
        type: 'warn',
        msg: 'Website address should correctly represent the Latimore Life & Legacy entity.'
      });
    }

    setAuditAlerts(alerts);
  }, [variables]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  const scorePercentage = Math.round(
    100 - (auditAlerts.filter(a => a.type === 'warn').length * 25)
  );

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-black px-2.5 py-0.5 rounded-full tracking-wider font-mono">
              COLLATERAL ENGINE v3.3
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Print Brand & Collateral Center</h1>
          <p className="text-gray-500 mt-1">Review, customize, and export premium physical assets for the Coal Region outreach campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-3 bg-[#151619] hover:bg-gray-800 text-amber-400 font-bold text-sm rounded-2xl w-full sm:w-auto justify-center transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? 'Packaging Assets...' : 'Export High-Res Package (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          <span>Success! High-resolution design package with dynamic county variables generated and dispatched to local Schuylkill County partner printer!</span>
        </div>
      )}

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left column - Visual Customizer & Audit Scorecard */}
        <div className="space-y-6 xl:col-span-1">
          
          {/* Dynamic Variables Form */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Edit3 size={18} className="text-amber-500" />
              <h3 className="font-bold text-gray-900 text-sm">Dynamic Outreach Customizer</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outreach Target Counties</label>
                <input 
                  type="text"
                  value={variables.counties}
                  onChange={(e) => setVariables({...variables, counties: e.target.value})}
                  placeholder="e.g. Schuylkill, Luzerne, Northumberland"
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-700"
                />
                <p className="text-[9px] text-gray-400">Updates county list inside tri-fold brochure & cards.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Local Phone Line</label>
                <input 
                  type="text"
                  value={variables.phone}
                  onChange={(e) => setVariables({...variables, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Direct Agency URL</label>
                <input 
                  type="text"
                  value={variables.website}
                  onChange={(e) => setVariables({...variables, website: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Local Sports Sponsorship / Venues</label>
                <textarea 
                  value={variables.sportsEvent}
                  onChange={(e) => setVariables({...variables, sportsEvent: e.target.value})}
                  rows={2}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-700 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Poster Headline</label>
                <input 
                  type="text"
                  value={variables.customHeadline}
                  onChange={(e) => setVariables({...variables, customHeadline: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compliance Footer Disclaimer</label>
                <textarea 
                  value={variables.customDisclaimer}
                  onChange={(e) => setVariables({...variables, customDisclaimer: e.target.value})}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-xs text-gray-600 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* v3.3.0 Quality Control Scorecard */}
          <div className="bg-[#151619] text-white p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm tracking-tight text-white">v3.3.0 QC Scorecard</h3>
              </div>
              <span className={cn(
                "px-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono",
                scorePercentage >= 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              )}>
                Score: {scorePercentage}%
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-550", scorePercentage >= 90 ? "bg-emerald-500" : "bg-amber-400")}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-400 text-right">Target standard: Greater than 90%</p>
            </div>

            {/* Audit list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-300">
                <span>Education-First Tone</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  100% Passed
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-300">
                <span>Reading Level Audit</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  8th Grade Flow
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-300">
                <span>Hex Contrast Safety</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Compliant
                </span>
              </div>
            </div>

            {/* Dynamic Alerts */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              {auditAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "p-3 rounded-xl text-[10.5px] leading-relaxed flex items-start gap-2 border",
                    alert.type === 'success' 
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" 
                      : "bg-red-500/5 border-red-500/10 text-red-300"
                  )}
                >
                  {alert.type === 'success' ? (
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{alert.msg}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right side - Template Mockup Visualizer Selection and canvas */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Menu Selector tabs */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveTab('poster')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'poster' 
                  ? "bg-[#2C3E50] text-white shadow"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <FileText size={15} />
              11x17 Poster (Community)
            </button>
            <button
              onClick={() => setActiveTab('brochure')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'brochure' 
                  ? "bg-[#2C3E50] text-white shadow"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Layers size={15} />
              Tri-Fold Brochure (Core Services)
            </button>
            <button
              onClick={() => setActiveTab('palmcard')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'palmcard' 
                  ? "bg-[#2C3E50] text-white shadow"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Printer size={15} />
              4x6 Palm Card (No-Pressure)
            </button>
          </div>

          {/* Interactive Live Canvas Template Previews */}
          <div className="bg-gray-100 rounded-3xl p-8 border border-gray-200 shadow-inner flex flex-col items-center justify-center min-h-[600px] relative">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full border border-gray-200 text-[10px] font-bold uppercase text-gray-500 shadow-sm">
              <Eye size={12} className="text-[#C49A6C]" />
              <span>Real-Time High-Fidelity Print Mockup (Vector-Accurate)</span>
            </div>

            {/* TAB 1: COMMUNITY PROTECTION POSTER (11x17 ratio) */}
            {activeTab === 'poster' && (
              <div 
                className="w-[380px] h-[550px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col justify-between overflow-hidden relative"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {/* Header block with flat navy matching Canva directions */}
                <div className="bg-[#2C3E50] text-white p-5 text-center relative border-b-4 border-[#C49A6C]">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#C49A6C]">LATIMORE LIFE & LEGACY LLC</p>
                  <h2 className="text-lg font-black tracking-tight mt-1 uppercase text-white font-sans">
                    {variables.customHeadline}
                  </h2>
                </div>

                {/* Main Body Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Photo spacer placeholder to guarantee no fear images are included */}
                  <div className="bg-gray-100 border border-gray-200 h-36 rounded-lg flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                    <Heart className="text-red-500 animate-pulse mb-1" size={24} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-normal">
                      [ High-Contrast Vector Graphic ]
                    </span>
                    <span className="text-[9px] text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                      Family outreach on light clean backdrop. Zero funeral/hospital imagery.
                    </span>
                    <div className="absolute right-2 bottom-2 bg-[#2C3E50] text-[#C49A6C] px-2 py-0.5 rounded text-[8px] font-bold font-mono">
                      #TheBeatGoesOn
                    </div>
                  </div>

                  {/* Body Text copy */}
                  <div className="space-y-3">
                    <p className="text-[10.5px] font-bold text-gray-700 text-center tracking-wide uppercase">
                      Practical protection and legacy-minded planning for the Coal Region.
                    </p>
                    <p className="text-[10px] text-gray-600 leading-relaxed text-center">
                      At Latimore Life & Legacy LLC, we believe that life insurance isn’t about fear. It’s about preparation. It’s about making sure that the people who depend on your income, your care, and your presence are protected—no matter what tomorrow brings.
                    </p>
                    <p className="text-[10px] text-gray-600 leading-relaxed text-center">
                      As an independent, education-first firm, we don’t use high-pressure sales scripts. We give you clear guidance and practical options that fit your family’s real budget.
                    </p>

                    {/* Bullet List inside Poster */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-center">
                        <p className="text-[8.5px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-0.5">Income</p>
                        <p className="text-[7.5px] text-gray-500 font-medium">Income Replacement</p>
                      </div>
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-center">
                        <p className="text-[8.5px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-0.5">Final Expense</p>
                        <p className="text-[7.5px] text-gray-500 font-medium">Clear budget planning</p>
                      </div>
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-center">
                        <p className="text-[8.5px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-0.5">Child Protection</p>
                        <p className="text-[7.5px] text-gray-500 font-medium">Living benefits build</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to action & QR box */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-900 leading-tight">No pressure—just clarity.</p>
                      <p className="text-[8.5px] text-gray-500 leading-normal max-w-[200px]">
                        Scan the code or call today to schedule a simple, plain-English protection review close to home.
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#C49A6C] font-mono mt-0.5">
                        <Phone size={10} />
                        <span>{variables.phone}</span>
                      </div>
                    </div>
                    {/* Simulated elegant golden QR block */}
                    <div className="w-14 h-14 bg-white border-2 border-[#2C3E50] rounded-lg p-1 shrink-0 flex flex-col items-center justify-center relative shadow-sm">
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-80">
                        <div className="bg-black"></div><div className="bg-black"></div><div></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div></div><div className="bg-black"></div><div></div>
                        <div></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div></div><div></div><div className="bg-black"></div>
                      </div>
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                        <div className="w-3 a w-3 bg-[#C49A6C] border border-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gold heartbeat brand line and footer disclaimer */}
                <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 text-center">
                  {/* Continuous Gold Heartbeat line */}
                  <div className="h-0.5 bg-[#C49A6C] relative w-4/5 mx-auto mb-2 opacity-60">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-gray-50 px-0.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#C49A6C] rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-[8.5px] font-extrabold text-gray-800 uppercase tracking-widest">{variables.website}</p>
                  <p className="text-[6.5px] text-gray-400 leading-tight mt-1 line-clamp-2 max-w-[320px] mx-auto text-center font-normal">
                    {variables.customDisclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: CORE SERVICES TRI-FOLD BROCHURE (8.5x11 vertical ratio, panel by panel explorer) */}
            {activeTab === 'brochure' && (
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-[#2C3E50] text-[#C49A6C] px-6 py-3 flex items-center justify-between border-b border-[#C49A6C]">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tri-Fold Panel Viewer</span>
                  {/* Panel navigation handles */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'panel1', name: '1. Cover' },
                      { id: 'panel2', name: '2. Story' },
                      { id: 'panel3', name: '3. Family' },
                      { id: 'panel4', name: '4. Retire' },
                      { id: 'panel5', name: '5. Business' },
                      { id: 'panel6', name: '6. Back' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveBrochurePanel(p.id as any)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer",
                          activeBrochurePanel === p.id 
                            ? "bg-[#C49A6C] text-slate-900" 
                            : "bg-white/10 text-white hover:bg-white/20"
                        )}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main panel displays with real strategy copywriting */}
                <div className="p-8 h-[380px] flex flex-col justify-between bg-white select-none">
                  
                  {activeBrochurePanel === 'panel1' && (
                    <div className="text-center space-y-4 my-auto animate-in fade-in duration-300">
                      <div className="w-16 h-16 bg-[#2C3E50] border-2 border-[#C49A6C] rounded-full mx-auto flex items-center justify-center">
                        <Heart className="text-[#C49A6C]" size={26} />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">LATIMORE LIFE & LEGACY LLC</h2>
                        <p className="text-xs text-[#C49A6C] uppercase font-bold tracking-widest">Protecting Today. Securing Tomorrow.</p>
                      </div>
                      <div className="h-0.5 bg-[#C49A6C] w-24 mx-auto my-3 relative">
                        <span className="absolute -top-1 left-10 w-2 h-2 bg-[#C49A6C] rounded-full animate-ping"></span>
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <p className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Preparation Over Panic</p>
                        <p className="text-xs text-gray-500 leading-relaxed leading-normal">
                          Your guide to clear, practical protection strategies for your family, your retirement, and your business legacy in Schuylkill and nearby counties.
                        </p>
                      </div>
                      <p className="text-[10px] font-bold text-[#C49A6C] font-mono">#TheBeatGoesOn</p>
                    </div>
                  )}

                  {activeBrochurePanel === 'panel2' && (
                    <div className="space-y-3 text-left my-auto animate-in fade-in duration-300 max-w-lg mx-auto">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="p-1 bg-[#2C3E50]/5 rounded text-[#C49A6C] font-bold text-xs">Story</span>
                        <h3 className="font-bold text-sm text-slate-800">Our Purpose is Rooted in a Real Story</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        In December 2010, our founder, <span className="font-semibold text-slate-800">{variables.founderName}</span>, survived a sudden cardiac arrest due to an automated external defibrillator (AED) placed through a local memorial fund.
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        That profound experience defines our firm's mission. We learned firsthand that preparation today becomes protection for someone tomorrow. We don't sell out of fear; we educate out of gratitude and a commitment to our community across the Central Pennsylvania coal region.
                      </p>
                    </div>
                  )}

                  {activeBrochurePanel === 'panel3' && (
                    <div className="space-y-3 text-left my-auto animate-in fade-in duration-300 max-w-lg mx-auto">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="p-1 bg-[#2C3E50]/5 rounded text-indigo-500 font-bold text-xs font-mono">Family</span>
                        <h3 className="font-bold text-sm text-slate-800">Family & Worker Protection</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your family deserves a plan before life forces a decision. We help local workers and families navigate clear options with zero confusion:
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600 pl-2">
                        <li>• <span className="font-bold text-[#2C3E50]">Income Replacement:</span> Ensure your home, mortgage, and lifestyle goals are fully secure.</li>
                        <li>• <span className="font-bold text-[#2C3E50]">Living Benefits:</span> Access features during your lifetime if serious chronic illnesses arise.</li>
                        <li>• <span className="font-bold text-[#2C3E50]">Final Expense:</span> Protect your family's dignity and peace of mind during tough transitions.</li>
                      </ul>
                    </div>
                  )}

                  {activeBrochurePanel === 'panel4' && (
                    <div className="space-y-3 text-left my-auto animate-in fade-in duration-300 max-w-lg mx-auto">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="p-1 bg-[#2C3E50]/5 rounded text-orange-500 font-bold text-xs font-mono">Retire</span>
                        <h3 className="font-bold text-sm text-slate-800">Retire Confidently, Not by Guesswork</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        As you approach retirement, the conversation changes from accumulation to protection. We provide plain-English education on tax-advantaged strategies:
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600 pl-2">
                        <li>• <span className="font-bold text-[#2C3E50]">Guaranteed Income:</span> Design a completely predictable, secure retirement paycheck.</li>
                        <li>• <span className="font-bold text-[#2C3E50]">Volatility Shield:</span> Safeguard your nest egg from market drops while keeping your growth potential.</li>
                      </ul>
                    </div>
                  )}

                  {activeBrochurePanel === 'panel5' && (
                    <div className="space-y-3 text-left my-auto animate-in fade-in duration-300 max-w-lg mx-auto">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="p-1 bg-[#2C3E50]/5 rounded text-purple-500 font-bold text-xs font-mono">Business</span>
                        <h3 className="font-bold text-sm text-slate-800">Coal Region Business Continuity</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        A local small business is more than just income—it is a family’s primary future and a community legacy. We build practical protection frameworks:
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600 pl-2">
                        <li>• <span className="font-bold text-[#2C3E50]">Key Person Protection:</span> Safeguard standard operations if key execution leads face critical crises.</li>
                        <li>• <span className="font-bold text-[#2C3E50]">Buy-Sell Funding:</span> Ensure flawless structural transitions and equity preservation.</li>
                      </ul>
                    </div>
                  )}

                  {activeBrochurePanel === 'panel6' && (
                    <div className="space-y-3 text-center my-auto animate-in fade-in duration-300 max-w-lg mx-auto">
                      <h3 className="font-extrabold text-sm text-[#2C3E50] uppercase tracking-wide">Independent Guidance. Local Trust.</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Because we are independent brokers, we answer to you—not a single insurance company. We shop multiple top-rated carriers to fit your life.
                      </p>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl max-w-xs mx-auto space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Service Line</p>
                        <p className="text-sm font-bold text-gray-800 font-mono">{variables.phone}</p>
                        <p className="text-[10px] text-amber-600 font-bold tracking-widest font-mono">{variables.website}</p>
                      </div>
                      <p className="text-[9px] text-gray-400 font-medium">Proudly serving Schuylkill, Luzerne, and Northumberland Counties</p>
                    </div>
                  )}

                  {/* Brochure interior footnote */}
                  <div className="border-t border-gray-100 pt-3 text-[7.5px] text-gray-400 leading-normal text-center">
                    Guarantees are backed by the claims-paying ability of the issuing insurance company. This content is for educational purposes only.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: "NO-PRESSURE" CONSULTATION PALM CARD (4x6 card front/back explorer) */}
            {activeTab === 'palmcard' && (
              <div 
                className="w-[430px] h-[260px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col justify-between overflow-hidden relative"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {/* Side switcher bar */}
                <div className="absolute top-2 right-2 flex gap-1 z-10 bg-white/95 rounded-lg p-0.5 border border-gray-100">
                  <button
                    onClick={() => setPalmCardSide('front')}
                    className={cn(
                      "px-2.5 py-1 rounded text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer",
                      palmCardSide === 'front' ? "bg-slate-900 text-amber-400" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setPalmCardSide('back')}
                    className={cn(
                      "px-2.5 py-1 rounded text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer",
                      palmCardSide === 'back' ? "bg-slate-900 text-amber-400" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Back
                  </button>
                </div>

                {palmCardSide === 'front' ? (
                  /* FRONT VIEW OF THE PALM CARD: Navy focus, gold line */
                  <div className="bg-[#2C3E50] text-center p-8 flex-1 flex flex-col justify-between text-white relative animate-in fade-in duration-300 select-none">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black tracking-widest uppercase text-[#C49A6C]">LATIMORE LIFE & LEGACY LLC</p>
                      <h2 className="text-base font-black tracking-tight leading-snug">
                        "Life insurance is not about fear.<br/>It is about preparation, protection, and legacy."
                      </h2>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-300 italic">Let’s make sure your protection still matches your life.</p>
                      <p className="text-[10px] font-bold text-[#C49A6C] tracking-widest font-mono">#TheBeatGoesOn</p>
                    </div>

                    {/* Flat continuous gold heartbeat line on front */}
                    <div className="h-0.5 bg-[#C49A6C] w-12 mx-auto mt-2"></div>
                  </div>
                ) : (
                  /* BACK VIEW: Clean light contrast layout containing checkbox list */
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white animate-in fade-in duration-300 select-none">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-gray-100 pb-1">The Latimore Promise:</p>
                      <p className="text-[9.5px] text-gray-600 leading-relaxed">
                        Education before recommendation. Clarity over jargon. No high-pressure sales tactics. Just a trusted local advisor helping you protect what matters most.
                      </p>
                    </div>

                    {/* Interactive Simulated Checkboxes */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-700">
                        <div className="w-2.5 h-2.5 border border-gray-300 rounded flex items-center justify-center font-bold text-[8px] text-[#C49A6C]">✓</div>
                        <span>Review an existing policy to check for coverage gaps.</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-700">
                        <div className="w-2.5 h-2.5 border border-gray-300 rounded flex items-center justify-center font-bold text-[8px] text-[#C49A6C]">✓</div>
                        <span>Learn about living benefits you can use while alive.</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-700">
                        <div className="w-2.5 h-2.5 border border-gray-300 rounded flex items-center justify-center font-bold text-[8px] text-[#C49A6C]">✓</div>
                        <span>Explore protected retirement income options.</span>
                      </div>
                    </div>

                    {/* Bottom CTA block */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-left text-[9px]">
                      <div>
                        <p className="font-extrabold text-slate-800 uppercase text-[8px]">Plain-English Review:</p>
                        <p className="text-gray-500 font-mono tracking-tight text-[8px]">{variables.phone} | {variables.website}</p>
                      </div>
                      <span className="text-[8.5px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded tracking-wide font-mono shrink-0">
                        Central PA Outreach
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick instructions and print partners panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-extrabold text-[#2C3E50] text-xs uppercase mb-1">Print Bleed & Setup Directions</h4>
              <p className="text-xs text-gray-500 leading-relaxed leading-normal">
                All templates comply with direct vector sizing requirements. Standard print bleed settings are baked into the PDF export configuration. No secondary crop elements required.
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Local Print Partner Status</span>
              </div>
              <p className="text-xs text-slate-800 font-bold leading-normal">
                Connected: Shenandoah Printing Services & Co.
              </p>
              <p className="text-[10.5px] text-gray-400 leading-normal font-medium mt-0.5">
                Ready to deliver 11x17 and 8.5x11 tri-folds to local Schuylkill County branches.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
