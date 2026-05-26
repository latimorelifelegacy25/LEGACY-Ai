import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Upload, 
  Play, 
  Pause, 
  RefreshCw, 
  Download, 
  Check, 
  AlertTriangle, 
  Sliders, 
  Image as ImageIcon, 
  Volume2, 
  MonitorPlay, 
  Layers, 
  Clock, 
  Database,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VeoAnimatorProps {
  onExportToWorkspace: (filename: string, content: string) => void;
  workspaceFiles: string[];
}

interface ImagePreset {
  id: string;
  name: string;
  url: string;
  type: 'portrait' | 'product';
  desc: string;
  tags: string[];
}

const PRESETS: ImagePreset[] = [
  {
    id: 'p1',
    name: "Jackson M. Latimore Sr.",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    type: 'portrait',
    desc: "Executive corporate style profile portrait frame. Perfect for living biography animations.",
    tags: ["Portrait", "Legacy", "Executive"]
  },
  {
    id: 'p2',
    name: "Pottsville Crimson Athletics Shield",
    url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=400",
    type: 'product',
    desc: "High school championship symbol with dynamic metal surfaces. Fits promotional video ads.",
    tags: ["Athletics", "PAHS", "Branded"]
  },
  {
    id: 'p3',
    name: "Coal Region Valley Sunset",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400",
    type: 'product',
    desc: "Cinematic sunset panorama over historical valley slopes. Fits background storytelling ads.",
    tags: ["Landscape", "Sunset", "Coal-Region"]
  },
  {
    id: 'p4',
    name: "Latimore Headquarters Executive Desk",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
    type: 'portrait',
    desc: "High-end corporate mahogany workspace setting. Ideal for trust branding.",
    tags: ["Office", "Professional", "Interior"]
  }
];

export const VeoAnimator: React.FC<VeoAnimatorProps> = ({ onExportToWorkspace, workspaceFiles }) => {
  const [selectedImage, setSelectedImage] = useState<string>(PRESETS[0].url);
  const [selectedImageId, setSelectedImageId] = useState<string>(PRESETS[0].id);
  const [animationType, setAnimationType] = useState<'product' | 'portrait'>('portrait');
  const [motionStyle, setMotionStyle] = useState<string>('ethereal-glide');
  const [cameraZoom, setCameraZoom] = useState<number>(1.2);
  const [frameRate, setFrameRate] = useState<number>(30);
  const [qualityPreset, setQualityPreset] = useState<'fast' | 'cinematic' | 'ultra'>('cinematic');
  const [ambientAudio, setAmbientAudio] = useState<boolean>(true);
  const [audioTrack, setAudioTrack] = useState<string>('corporate');
  const [promptOverlay, setPromptOverlay] = useState<string>(
    "Ethereal slow zoom into focus, warm volumetric light beams, dynamic atmospheric micro-dust floating, hyper-realistic detail tracking"
  );
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [exportComplete, setExportComplete] = useState<boolean>(false);
  const [importedImageName, setImportedImageName] = useState<string | null>(null);

  // Drag & drop state
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startGeneration = () => {
    setIsGenerating(true);
    setGenerationSteps([]);
    setProgressVal(0);
    setGeneratedVideoUrl(null);
    setExportComplete(false);

    const steps = [
      "Running semantic parse on image structure...",
      "Extracting spatial camera parameters & volumetric maps...",
      "Synthesizing high-fidelity optical flow paths with Veo 3 renderer...",
      "Generating temporal consistency models to prevent artifact flicker...",
      "Overlaying chosen cinematic micro-particles & volumetric beams...",
      "Rendering final MP4 stream and syncing with audio tracks..."
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setProgressVal(prev => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedVideoUrl("GENERATED");
          setIsPlaying(true);
          return 100;
        }
        
        // Push steps progress logically
        const sliceIdx = Math.floor((next / 100) * steps.length);
        if (sliceIdx > currentStepIdx && sliceIdx < steps.length) {
          currentStepIdx = sliceIdx;
          setGenerationSteps(prevSteps => [...prevSteps, steps[currentStepIdx]]);
        }
        return next;
      });
    }, 180);

    setGenerationSteps([steps[0]]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setSelectedImageId('custom');
          setImportedImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setSelectedImageId('custom');
          setImportedImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportVideoToWorkspace = () => {
    const filename = `veo3_ad_${Date.now()}.mp4`;
    const mockContent = `[VEO-3 REALTIME EMBEDDED RENDER DATA]\nImage Source ID: ${selectedImageId}\nMotion Style: ${motionStyle}\nCamera Zoom: ${cameraZoom}x\nFrame rate: ${frameRate}fps\nAudio Track: ${audioTrack}\nVisual Prompt Direction: ${promptOverlay}`;
    onExportToWorkspace(filename, mockContent);
    setExportComplete(true);
  };

  return (
    <div className="space-y-6">
      {/* Header section with luxurious visual signature */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[rgba(44,62,80,0.12)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#2C3E50] tracking-tight flex items-center gap-2">
            <Video className="text-[#C49A6C] animate-pulse" size={20} />
            Veo 3 AI Image-to-Video Studio
          </h2>
          <p className="text-xs text-[#6b6b6b] mt-0.5">
            Bring Latimore Life & Legacy product collaterals, executive portraits, and regional sunset frames into high-end animated videos.
          </p>
        </div>
        <div className="font-mono text-[9px] text-[#8B6A45] font-bold tracking-widest uppercase flex items-center gap-1.5 bg-[#E8D5B7]/25 p-1.5 px-3 rounded-md border border-[#C49A6C]/30 mr-2 shadow-sm">
          <Sparkles size={11} className="text-[#C49A6C] animate-pulse" />
          Veo 3 Frame Engine: <span className="text-emerald-600 font-extrabold animate-pulse">Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Deck (Grid span 5) */}
        <div className="lg:col-span-5 bg-white border border-[rgba(44,62,80,0.12)] p-5 rounded-2xl shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-[#C49A6C]" />
              Creative Control Deck
            </h3>
            <p className="text-[10px] text-[#6b6b6b] mt-0.5">Configure prompt overlays, motion coefficients, and audio streams.</p>
          </div>

          {/* Animation Intent Toggle */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500">Animation Objective</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAnimationType('portrait');
                  setPromptOverlay("Cinematic subtle breathing cycle, natural eye blinks, soft professional focus tracking, elegant corporate backdrop flow");
                }}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  animationType === 'portrait'
                    ? 'bg-[#E8D5B7]/15 border-[#C49A6C] text-[#8B6A45] shadow-sm'
                    : 'bg-[#fafaf9] border-slate-200 text-[#6b6b6b] hover:text-[#2C3E50] hover:border-slate-300'
                }`}
              >
                <ImageIcon size={16} className={animationType === 'portrait' ? 'text-[#8B6A45]' : 'text-[#6b6b6b]'} />
                <span className="text-xs font-bold mt-1">Living Portrait</span>
                <span className="text-[8px] opacity-75 leading-tight mt-0.5">Animate profiles & executives</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnimationType('product');
                  setPromptOverlay("Anamorphic 3D spatial rotation, fluid metallic light gleams sweeping across surfaces, dynamic background zoom, commercial style");
                }}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  animationType === 'product'
                    ? 'bg-[#E8D5B7]/15 border-[#C49A6C] text-[#8B6A45] shadow-sm'
                    : 'bg-[#fafaf9] border-slate-200 text-[#6b6b6b] hover:text-[#2C3E50] hover:border-slate-300'
                }`}
              >
                <Volume2 size={16} className={animationType === 'product' ? 'text-[#8B6A45]' : 'text-[#6b6b6b]'} />
                <span className="text-xs font-bold mt-1">Product Video Ad</span>
                <span className="text-[8px] opacity-75 leading-tight mt-0.5">Turn banner art to video ads</span>
              </button>
            </div>
          </div>

          {/* Motion style select */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500">Camera Flow Style</label>
            <select
              value={motionStyle}
              onChange={(e) => setMotionStyle(e.target.value)}
              className="w-full text-xs p-2 px-3 bg-[#fafaf9] rounded-xl border border-slate-200 text-[#2C3E50] font-medium outline-none focus:border-[#C49A6C]"
            >
              <option value="ethereal-glide">Ethereal Cinematic Glide (Slow Pan & Rise)</option>
              <option value="liquid-rot">Liquid Surface Rotation (3D Geometry Orbit)</option>
              <option value="dramatic-zoom">Atmospheric Dramatic Zoom (Rapid Highlight Inbound)</option>
              <option value="light-sweep">Macro Focus Sweep (Shallow Depth & Prism Flares)</option>
            </select>
          </div>

          {/* Prompt overlay customized box */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-500">Camera Prompts (Veo Guidance)</label>
              <span className="text-[9px] text-[#C49A6C] font-semibold">Strict Compliance Rules Checked</span>
            </div>
            <textarea
              value={promptOverlay}
              onChange={(e) => setPromptOverlay(e.target.value)}
              placeholder="e.g., Volumetric sunset rays illuminating Pottsville Area shield, realistic camera tilt..."
              className="w-full text-xs bg-[#fafaf9] border border-slate-200 focus:border-[#C49A6C] rounded-xl p-3 h-18 resize-none outline-none font-sans text-slate-700 leading-normal"
            />
          </div>

          {/* Precise configuration coefficient sliders */}
          <div className="space-y-4 bg-[#fafaf9] p-3 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5 border-b pb-1.5 mb-2">
              <Layers size={11} className="text-[#C49A6C]" /> Motion Coefficients
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-[#6b6b6b]">Camera Motion Amplitude</span>
                <span className="text-[#2C3E50]">{cameraZoom}x zoom velocity</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={cameraZoom}
                onChange={(e) => setCameraZoom(parseFloat(e.target.value))}
                className="w-full accent-[#C49A6C] h-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-[#6b6b6b]">Target Frames Per Second</span>
                <span className="text-[#2C3E50]">{frameRate} fps</span>
              </div>
              <input
                type="range"
                min="24"
                max="60"
                step="6"
                value={frameRate}
                onChange={(e) => setFrameRate(parseInt(e.target.value))}
                className="w-full accent-[#C49A6C] h-1"
              />
            </div>

            {/* Quality preset select */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[
                { id: 'fast', label: 'PREVIEW' },
                { id: 'cinematic', label: 'VEO 3 HD' },
                { id: 'ultra', label: 'VEO 3 4K' }
              ].map(qp => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => setQualityPreset(qp.id as any)}
                  className={`py-1 text-[9px] font-bold rounded-md transition-all border ${
                    qualityPreset === qp.id 
                      ? 'bg-[#2C3E50] border-[#2C3E50] text-[#C49A6C]' 
                      : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient audio configuration */}
          <div className="space-y-3 p-3 bg-[#fafaf9] rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Volume2 size={12} className="text-[#C49A6C]" /> Branded Ambient Audio
              </label>
              <input
                type="checkbox"
                checked={ambientAudio}
                onChange={(e) => setAmbientAudio(e.target.checked)}
                className="w-4 h-4 accent-[#C49A6C] cursor-pointer"
              />
            </div>
            
            {ambientAudio && (
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                className="w-full text-[11px] p-1.5 bg-white border rounded outline-none text-slate-600 focus:border-[#C49A6C]"
              >
                <option value="corporate">Trust & Legacy Uplifting Theme (Instrumental)</option>
                <option value="focus">Coal Region Community Pride (Warm Acoustic Drums)</option>
                <option value="tech">Future Vision Minimalist Accent (Electronic Beats)</option>
              </select>
            )}
          </div>

          {/* Trigger Synthesis Button */}
          <button
            type="button"
            onClick={startGeneration}
            disabled={isGenerating}
            className="w-full bg-[#2C3E50] hover:bg-[#3d5166] active:bg-[#1a2a38] text-white py-3 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all text-center shadow-md border-b-[3px] border-[#1a1f2e] cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Synthesizing with Veo 3 engine ({progressVal}%)
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-[#C49A6C]" /> Bring Image to Life with Veo 3 ↗
              </>
            )}
          </button>
        </div>

        {/* Right Active Stage & Presets (Grid span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Canvas Frame */}
          <div className="bg-white border border-[rgba(44,62,80,0.12)] p-4 rounded-2xl shadow-sm flex flex-col min-h-[380px] justify-between relative overflow-hidden">
            {/* Stage Title */}
            <div className="flex items-center justify-between border-b pb-2.5 mb-3">
              <span className="text-[10px] uppercase font-bold text-[#2C3E50] tracking-wider flex items-center gap-1">
                <MonitorPlay size={13} className="text-[#C49A6C]" /> Veo 3 Live Monitor Frame
              </span>

              {importedImageName && (
                <div className="text-[10px] text-slate-400 max-w-[200px] truncate bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  Imported: <span className="font-semibold text-slate-600">{importedImageName}</span>
                </div>
              )}
            </div>

            {/* Simulated Live Renderer / Animate Canvas */}
            <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl relative h-[250px] overflow-hidden group shadow-inner border border-slate-800">
              {isGenerating ? (
                // GENERATION PROGRESS OVERLAY OVER BASE IMAGE
                <div className="absolute inset-0 bg-[#000]/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#1e293b"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#C49A6C"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - progressVal / 100)}
                      />
                    </svg>
                    <span className="absolute text-xs font-bold font-mono text-[#C49A6C]">{progressVal}%</span>
                  </div>
                  
                  {/* Step Status lines */}
                  <div className="h-10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={generationSteps.length}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[11px] text-slate-300 font-medium font-mono leading-relaxed"
                      >
                        {generationSteps[generationSteps.length - 1] || "Initializing modules..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              ) : null}

              {/* Dynamic Video Simulation Canvas with CSS & framer motion filter-sweeps */}
              {generatedVideoUrl ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Animated image simulating the exact motion presets */}
                  <motion.div
                    animate={isPlaying ? {
                      scale: animationType === 'product' ? [1, cameraZoom, 1] : [1, 1.05, 1],
                      rotate: animationType === 'product' && motionStyle === 'liquid-rot' ? [0, 8, -4, 0] : [0, 0],
                      y: motionStyle === 'ethereal-glide' ? [0, -8, 4, 0] : [0, 0]
                    } : {}}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ backgroundImage: `url(${selectedImage})` }}
                    className="absolute inset-0 bg-cover bg-center brightness-100 contrast-105"
                  />

                  {/* Lens Flare Overlay sweeping */}
                  <motion.div 
                    animate={isPlaying ? {
                      left: ['-50%', '150%'],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                    className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-10"
                  />

                  {/* Floating ambient fireflies / glowing dots */}
                  {isPlaying && (
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-65">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <motion.div
                          key={item}
                          animate={{
                            y: [280, -20, 280],
                            x: [Math.random() * 320, Math.random() * 320],
                            opacity: [0, 0.6, 0]
                          }}
                          transition={{
                            duration: 5 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute w-1.5 h-1.5 bg-[#C49A6C] rounded-full blur-[0.5px]"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Play & Pause Controls */}
                  <div className="absolute bottom-3 left-3 bg-[#111]/85 border border-slate-800 rounded-lg p-1.5 px-3 z-10 text-white flex items-center gap-2 text-[10px] font-mono leading-none">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-[#C49A6C] cursor-pointer"
                    >
                      {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                    </button>
                    <span className="text-slate-400 select-none">|</span>
                    <span className="text-[#C49A6C] font-semibold animate-pulse">Veo 3: Living Rendering</span>
                  </div>

                  {/* Live prompt subtitle bar */}
                  <div className="absolute bottom-3 right-3 max-w-[250px] truncate bg-[#111]/85 border border-slate-800 rounded-lg p-1.5 px-3 z-10 text-white text-[9px] font-mono text-right font-medium text-slate-400">
                    Prompt: "{promptOverlay}"
                  </div>
                </div>
              ) : (
                // STILL / BASE IMAGE MODE (BEFORE RENDER)
                <div className="absolute inset-0 bg-cover bg-center flex items-center justify-center transition-all bg-slate-900 border" style={{ backgroundImage: `url(${selectedImage})` }}>
                  <div className="absolute inset-0 bg-black/40" />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-[#111625]/90 border border-slate-800 p-4 rounded-xl text-center text-white max-w-xs space-y-2 backdrop-blur-sm shadow-xl z-10"
                  >
                    <Sparkles className="mx-auto text-[#C49A6C] animate-pulse" size={24} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Input Frame Locked</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Pick a camera style, adjust sliders, and tap "Bring Image to Life" to synthetically animate this framespace.
                    </p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Post-Action Command Deck (Export, Share, Copy) */}
            <div className="border-t pt-3 mt-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex gap-2 text-[10px] items-center">
                <span className="text-slate-400 font-mono">Format: API streaming MP4</span>
                <span className="w-1 h-1 bg-[#C49A6C] rounded-full" />
                <span className="text-[#6b6b6b] font-bold">Bitrate: Variable Target (H.265)</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!generatedVideoUrl || exportComplete}
                  onClick={exportVideoToWorkspace}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    exportComplete
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                      : !generatedVideoUrl
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border'
                        : 'bg-white border text-slate-700 hover:text-[#C49A6C] hover:border-[#C49A6C] shadow-sm'
                  }`}
                >
                  {exportComplete ? (
                    <>
                      <Check size={11} /> Synced to Local Files
                    </>
                  ) : (
                    <>
                      <Database size={11} /> Save directly into Local Explorer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preset Image Library & Drag Zone */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Drag and Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`md:col-span-2 rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${
                dragOver 
                  ? 'border-[#C49A6C] bg-[#E8D5B7]/10' 
                  : 'border-slate-200 bg-[#fdfcfa] hover:border-[#C49A6C] hover:bg-slate-50/50'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="text-[#C49A6C] mb-2 animate-bounce" size={18} />
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Upload Custom Image</div>
              <p className="text-[9px] text-[#6b6b6b] leading-tight mt-1 px-1">
                Drag-and-drop or select any product photo or executive portrait
              </p>
            </div>

            {/* Presets List */}
            <div className="md:col-span-3 bg-white border border-[rgba(44,62,80,0.12)] p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E50] block mb-2">Preset Branded Asset Frames</span>
              
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(preset => {
                  const isCurPreset = preset.id === selectedImageId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setSelectedImageId(preset.id);
                        setImportedImageName(null);
                        if (preset.type === 'portrait') {
                          setAnimationType('portrait');
                          setPromptOverlay("Cinematic subtle breathing cycle, natural eye blinks, soft professional focus tracking, elegant corporate backdrop flow");
                        } else {
                          setAnimationType('product');
                          setPromptOverlay("Anamorphic 3D spatial rotation, fluid metallic light gleams sweeping across surfaces, dynamic background zoom, commercial style");
                        }
                      }}
                      className={`flex gap-2 p-1.5 rounded-lg text-left transition-all cursor-pointer border ${
                        isCurPreset 
                          ? 'border-[#C49A6C] bg-[#E8D5B7]/10' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded object-cover shadow-sm" />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-slate-800 truncate leading-tight">{preset.name}</span>
                        <span className="text-[8px] text-[#C49A6C] font-semibold uppercase font-mono mt-0.5 leading-none">{preset.type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
