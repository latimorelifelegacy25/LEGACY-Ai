import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  Terminal, 
  FolderTree, 
  Play, 
  RefreshCcw, 
  Layers, 
  ChevronRight, 
  Database, 
  Search, 
  Sheet, 
  Presentation, 
  Users, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  FileCode, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Code, 
  Sparkle,
  MessageCircle,
  Copy,
  ExternalLink,
  Laptop
} from 'lucide-react';

// Brand-standard colors matches Latimore Hub OS aesthetic, dark-workspace
const COL = {
  navy: "#2C3E50",
  slate: "#3D5166",
  gold: "#C49A6C",
  goldLight: "#D4AE86",
  goldDark: "#A07840",
  charcoal: "#16202A",
  darker: "#0E141B",
  emerald: "#10B981",
  rose: "#EF4444",
  cyan: "#06B6D4",
  purple: "#8B5CF6"
};

// Types & Schemas
interface ModelCompare {
  name: string;
  provider: string;
  type: 'commercial' | 'opensource';
  costPer1M: { input: number; output: number };
  latency: string;
  speed: number; // tokens/sec
  accuracyIndex: number; // 0-100
  color: string;
}

const CONST_MODELS: ModelCompare[] = [
  { name: 'GPT-4o', provider: 'OpenAI', type: 'commercial', costPer1M: { input: 2.50, output: 10.00 }, latency: '1.1s', speed: 85, accuracyIndex: 96, color: '#10A37F' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', type: 'commercial', costPer1M: { input: 3.00, output: 15.00 }, latency: '1.4s', speed: 70, accuracyIndex: 98, color: '#D97706' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', type: 'commercial', costPer1M: { input: 1.25, output: 5.00 }, latency: '0.9s', speed: 120, accuracyIndex: 94, color: '#1E3A8A' },
  { name: 'Llama 3 70B', provider: 'Meta (SaaS)', type: 'opensource', costPer1M: { input: 0.60, output: 0.90 }, latency: '0.7s', speed: 110, accuracyIndex: 89, color: '#3B82F6' },
  { name: 'DeepSeek-V3', provider: 'DeepSeek (Self)', type: 'opensource', costPer1M: { input: 0.14, output: 0.28 }, latency: '1.3s', speed: 60, accuracyIndex: 95, color: '#2563EB' },
  { name: 'Qwen-2.5-Coder', provider: 'Alibaba (Self)', type: 'opensource', costPer1M: { input: 0.20, output: 0.40 }, latency: '0.8s', speed: 135, accuracyIndex: 92, color: '#8B5CF6' }
];

interface ThinkingStep {
  agent: string;
  message: string;
  status: 'pending' | 'active' | 'success' | 'info';
  timestamp: string;
}

interface DBTable {
  name: string;
  columns: { name: string; type: string; primary?: boolean }[];
}

interface ResearchRow {
  symbol: string;
  company: string;
  price: number;
  revenue: number; // in Millions
  pe: number;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
}

const INITIAL_RESEARCH_DATA: ResearchRow[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 182.40, revenue: 385000, pe: 28.5, sentiment: 'Bullish' },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 415.50, revenue: 245000, pe: 35.2, sentiment: 'Bullish' },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 172.10, revenue: 307000, pe: 26.1, sentiment: 'Bullish' },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 180.20, revenue: 574000, pe: 41.8, sentiment: 'Neutral' },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 175.40, revenue: 96000, pe: 52.4, sentiment: 'Bearish' }
];

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  theme: 'minimal' | 'executive' | 'technical';
}

const INITIAL_SLIDES: Slide[] = [
  { id: 1, title: 'Latimore Core Orchestrator', subtitle: 'The Future of Autonomous Workspaces via MoA', bullets: ['Automated inner-loop reasoning framework', 'Direct task routing to specialized foundation backends', 'Continuous cost and speed optimization feedback loops'], theme: 'minimal' },
  { id: 2, title: 'Mixture-of-Agents (MoA) Advantage', subtitle: 'Harnessing the Collective Power of Frontier Networks', bullets: ['Claude 3.5 Sonnet handles mission-critical logical blocks', 'Gemini Pro performs ultra-long visual context analyses', 'DeepSeek-V3 executes cost-effective high-frequency lookups'], theme: 'executive' },
  { id: 3, title: 'Operational Architecture Metrics', subtitle: 'Enterprise Scale Performance & Cost Projection', bullets: ['Up to 72% average reduction in model token lookup costs', '98.4% success score evaluated by LLM-as-a-Judge', 'Secure Docker execution runtimes protect workspace isolation'], theme: 'technical' }
];

interface WebSocketLog {
  id: string;
  time: string;
  event: string;
  payload: string;
}

export function GensparkWorkspace() {
  // Navigation & Primary modes
  const [modelType, setModelType] = useState<'commercial' | 'opensource'>('commercial');
  const [activeSub, setActiveSub] = useState<'agent' | 'developer' | 'research' | 'slides' | 'collab'>('agent');
  
  // prompt Orchestrator state
  const [promptInput, setPromptInput] = useState<string>('Build a collaborative portfolio analytics dashboard that pulls Q1 financial logs, compiles a docker file, and generates pitch slides.');
  const [isOrchestrated, setIsOrchestrated] = useState<boolean>(false);
  const [orchestrating, setOrchestrating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [routerProgress, setRouterProgress] = useState({ openai: 0, anthropic: 0, google: 0, openSource: 0 });
  const [judgeScore, setJudgeScore] = useState({ security: 0, speed: 0, formatting: 0, total: 0 });
  
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  
  // Multi-Model Metrics Cumulative Values
  const [totalTokens, setTotalTokens] = useState<number>(342000);
  const [totalQueries, setTotalQueries] = useState<number>(84);
  const [dollarsSaved, setDollarsSaved] = useState<number>(142.85);

  // 1. AI Developer States
  const [devFiles, setDevFiles] = useState<{ name: string; content: string }[]>([
    { name: 'server.py', content: 'from fastapi import FastAPI\nimport pandas as pd\n\napp = FastAPI()\n\n@app.get("/api/data")\ndef read_data():\n    df = pd.read_csv("stocks.csv")\n    return df.to_dict(orient="records")\n' },
    { name: 'Dockerfile', content: 'FROM python:3.10-slim\nWORKDIR /app\nCOPY . .\nRUN pip install fastapi uvicorn pandas\nEXPOSE 3000\nCMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "3000"]' },
    { name: 'schema.sql', content: '-- Latimore Hub SQL Schema\n\nCREATE TABLE core_users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    tier VARCHAR(50) DEFAULT \'platinum\'\n);' },
  ]);
  const [selectedDevFile, setSelectedDevFile] = useState<string>('server.py');
  const [editorContent, setEditorContent] = useState<string>('');
  const [devLogs, setDevLogs] = useState<string[]>(['Container sandbox idle. Ready for instruction...']);
  const [dbTables, setDbTables] = useState<DBTable[]>([
    { name: 'core_users', columns: [{ name: 'id', type: 'SERIAL (PK)', primary: true }, { name: 'email', type: 'VARCHAR(255)' }, { name: 'tier', type: 'VARCHAR(50)' }] },
    { name: 'portfolios', columns: [{ name: 'id', type: 'INTEGER (PK)', primary: true }, { name: 'user_id', type: 'INTEGER (FK)' }, { name: 'nav', type: 'NUMERIC(14,2)' }] }
  ]);
  const [newTableName, setNewTableName] = useState<string>('');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [compiling, setCompiling] = useState<boolean>(false);

  // 2. Deep Research & Sheets States
  const [researchTopic, setResearchTopic] = useState<string>('Quantum Computing hardware startups funding rounds 2026');
  const [scrapedUrls, setScrapedUrls] = useState<{ url: string; status: number; title: string }[]>([]);
  const [researchSheet, setResearchSheet] = useState<ResearchRow[]>(INITIAL_RESEARCH_DATA);
  const [formulaResult, setFormulaResult] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<string>('');

  // 3. AI Slides States
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [imagePrompt, setImagePrompt] = useState<string>('A vibrant multi-model holographic neural workspace glowing with green laser optics, cyberpunk aesthetic, dark UI elements, cinematic light');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageGenerating, setImageGenerating] = useState<boolean>(false);

  // 4. AI Workspace & Multiplayer States
  const [docContent, setDocContent] = useState<string>('Latimore Collaborative Workspace Protocol:\nAll autonomous agents have successfully synchronized into this environment. Select a block to begin local evaluation.');
  const [cursors, setCursors] = useState<{ name: string; x: number; y: number; color: string; typing?: string }[]>([
    { name: 'Aria (Product)', x: 120, y: 80, color: '#10B981', typing: 'Planning' },
    { name: 'Liam (Dev)', x: 380, y: 150, color: '#8B5CF6', typing: 'Compiling server.py' },
    { name: 'Evelyn (QA)', x: 620, y: 220, color: '#06B6D4', typing: 'Auditing secure tokens' }
  ]);
  const [socketLogs, setSocketLogs] = useState<WebSocketLog[]>([]);
  
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Toggle active editing file
  useEffect(() => {
    const file = devFiles.find(f => f.name === selectedDevFile);
    if (file) {
      setEditorContent(file.content);
    }
  }, [selectedDevFile, devFiles]);

  // Handle typing inside editor
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    setDevFiles(prev => prev.map(f => f.name === selectedDevFile ? { ...f, content: e.target.value } : f));
  };

  // Simulate cursor movement for workspace collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => {
        // Random drift within bounding box
        const dx = (Math.random() - 0.5) * 55;
        const dy = (Math.random() - 0.5) * 35;
        const newX = Math.max(20, Math.min(750, cursor.x + dx));
        const newY = Math.max(20, Math.min(320, cursor.y + dy));
        
        // Random typing updates
        const activities = ['Planning', 'Tracing API', 'Compiling', 'Reviewing Code', 'Structuring Sheets', 'Idle'];
        const randomActivity = Math.random() > 0.6 ? activities[Math.floor(Math.random() * activities.length)] : cursor.typing;

        return {
          ...cursor,
          x: newX,
          y: newY,
          typing: randomActivity
        };
      }));

      // Add socket log entry sometimes
      if (Math.random() > 0.4) {
        setSocketLogs(prev => [
          {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString(),
            event: ['cursor_moved', 'cell_lock_acquired', 'sync_state', 'payload_emitted'][Math.floor(Math.random() * 4)],
            payload: `Source: ${['Aria', 'Liam', 'Evelyn'][Math.floor(Math.random() * 3)]} -> Client Coordinate update`
          },
          ...prev.slice(0, 15)
        ]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Trigger mixture-of-agents orchestration
  const triggerOrchestration = () => {
    if (orchestrating) return;
    setOrchestrating(true);
    setIsOrchestrated(false);
    setThinkingSteps([]);
    setActiveStepIndex(0);
    
    // Animate Router allocations
    setRouterProgress({ openai: 5, anthropic: 10, google: 15, openSource: 5 });

    const steps: ThinkingStep[] = [
      { agent: 'Orchestrating Agent', message: 'Analyzing prompt semantic structure and identifying subtask boundaries...', status: 'active', timestamp: 'T+0s' },
      { agent: 'Task Router', message: 'Routing determined: Core Logic -> Claude 3.5; Live News Web Scrape -> Gemini Pro; Creative Content -> OpenAI GPT-4o', status: 'pending', timestamp: 'T+0.8s' },
      { agent: 'Tool Broker', message: 'Locked 3 registry credentials. Activating isolated sandbox environment context and Web Crawler APIs...', status: 'pending', timestamp: 'T+1.5s' },
      { agent: 'Autonomous Worker', message: 'Generating core templates, structuring databases schema arrays and file system endpoints...', status: 'pending', timestamp: 'T+2.4s' },
      { agent: 'Evaluation Loop', message: 'Running LLM-as-a-judge check. Auditing generated syntax execution and docker isolation policies...', status: 'pending', timestamp: 'T+3.5s' },
      { agent: 'Mixture-of-Agents', message: 'Validation successful. Result compiled and served across all local operational workspaces!', status: 'pending', timestamp: 'T+4.5s' }
    ];

    setThinkingSteps(steps);

    let stepCounter = 0;
    const interval = setInterval(() => {
      setThinkingSteps(prev => prev.map((curr, idx) => {
        if (idx === stepCounter) {
          return { ...curr, status: 'success' };
        } else if (idx === stepCounter + 1) {
          return { ...curr, status: 'active' };
        }
        return curr;
      }));

      stepCounter++;
      setActiveStepIndex(stepCounter);

      // Dynamically load some metrics
      if (stepCounter === 1) {
        setRouterProgress({ openai: 45, anthropic: 85, google: 65, openSource: 18 });
      }
      if (stepCounter === 3) {
        setTotalTokens(prev => prev + 12800);
        setTotalQueries(prev => prev + 1);
        setDollarsSaved(prev => prev + 4.82);
      }
      if (stepCounter === 4) {
        setRouterProgress({ openai: 88, anthropic: 98, google: 95, openSource: 35 });
        setJudgeScore({ security: 98, speed: 92, formatting: 96, total: 95 });
      }

      if (stepCounter >= steps.length) {
        clearInterval(interval);
        setOrchestrating(false);
        setIsOrchestrated(true);
        // Add default log inside system consoles
        setDevLogs(prev => [
          `[System Hub] MoA triggered successfully for custom prompt query!`,
          `Generated files successfully under /app context directory.`,
          ...prev
        ]);
      }
    }, 1200);
  };

  // Click on workspace to trigger custom user cursor placement
  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Output visual message log
    setSocketLogs(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString(),
        event: 'user_pointer_sync',
        payload: `Evaluated User Coordinates: X=${x.toFixed(0)}, Y=${y.toFixed(0)} - Broadcasted to MoA cluster`
      },
      ...prev
    ]);
  };

  // Executing Docker & Server simulation
  const compileWorkspaceSandbox = () => {
    if (compiling) return;
    setCompiling(true);
    setDeployUrl(null);
    setDevLogs(prev => [
      '>> Executing isolated standard docker launch sequence...',
      'Step 1/5: Loading base image (python:3.10-slim)...',
      ...prev
    ]);

    setTimeout(() => {
      setDevLogs(prev => [
        'Step 2/5: Synchronizing virtual package directories...',
        'Step 3/5: Running [pip install fastapi uvicorn pandas] package list...',
        '  Downloading fastapi-0.100.0-py3-none-any.whl (130 kB)',
        '  Downloading pandas-2.0.3-cp310-manylinux2014_x86_64.whl (12.3 MB)',
        ...prev
      ]);
    }, 1200);

    setTimeout(() => {
      setDevLogs(prev => [
        'Step 4/5: Compiling sqlite3 schema elements inside /schema.sql...',
        'Step 5/5: Exposing local port binding [0.0.0.0:3000] -> Ready for requests',
        '>> Server listening on http://0.0.0.0:3000 (Docker environment verified)',
        '>> Sandbox hot-reload initiated. Deployment endpoint active.',
        ...prev
      ]);
      setDeployUrl(`https://sandbox-auth-run-applet-${Math.floor(100000 + Math.random() * 900000)}.run.app`);
      setCompiling(false);
    }, 2800);
  };

  // Add DB Table to AI Developer workspace
  const addDbTable = () => {
    if (!newTableName.trim()) return;
    const newT: DBTable = {
      name: newTableName.toLowerCase().replace(/\s+/g, '_'),
      columns: [
        { name: 'id', type: 'SERIAL (PK)', primary: true },
        { name: 'created_at', type: 'TIMESTAMP' },
        { name: 'status', type: 'VARCHAR(100)' }
      ]
    };
    setDbTables(prev => [...prev, newT]);
    setDevFiles(prev => prev.map(f => {
      if (f.name === 'schema.sql') {
        const appended = `${f.content}\n\nCREATE TABLE ${newT.name} (\n    id SERIAL PRIMARY KEY,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    status VARCHAR(100)\n);`;
        return { ...f, content: appended };
      }
      return f;
    }));
    setNewTableName('');
    setDevLogs(prev => [`Database architecture model updated: Added table [${newT.name}]`, ...prev]);
  };

  // Trigger Deep Research Scrapers
  const executeResearchCrawler = () => {
    if (isResearching) return;
    setIsResearching(true);
    setScrapedUrls([]);
    setResearchProgress('Evaluating queries and query-expansion matrices...');

    setTimeout(() => {
      setResearchProgress('Spawning crawlers to locate funding rounds...');
      setScrapedUrls([
        { url: 'https://techcrunch.com/2026/quantum-computing-funds', status: 200, title: 'TechCrunch | Quantum hardware startups secure mega-rounds' },
        { url: 'https://sec.gov/news/press-release-quantum-growth', status: 200, title: 'SEC.gov | Quarterly filings and metrics' }
      ]);
    }, 800);

    setTimeout(() => {
      setResearchProgress('Parsing structured PDF datasets and executing LLM summarizers...');
      setScrapedUrls(prev => [
        ...prev,
        { url: 'https://arxiv.org/html/2604.14810v1', status: 200, title: 'arXiv | Quantum System co-processors scalability parameters' },
        { url: 'https://news.ycombinator.com/item?id=q-round', status: 404, title: 'Hacker News | Discussion on hardware startup valuations' }
      ]);
    }, 1800);

    setTimeout(() => {
      setResearchProgress('Compiling spreadsheet logs...');
      const newResearchSet: ResearchRow[] = [
        { symbol: 'QBIT', company: 'QuantumOptics Inc', price: 14.20, revenue: 12000, pe: 110.4, sentiment: 'Bullish' },
        { symbol: 'COPR', company: 'HeliumCryo Labs', price: 9.85, revenue: 4500, pe: 85.0, sentiment: 'Bullish' },
        ...INITIAL_RESEARCH_DATA
      ];
      setResearchSheet(newResearchSet);
      setIsResearching(false);
      setResearchProgress('Deep Research complete. 4 streams integrated into working sheet.');
    }, 3200);
  };

  // Execute Spreadsheet Formula
  const executeFormula = (fType: 'sum' | 'avg' | 'sentiment') => {
    if (fType === 'sum') {
      const sum = researchSheet.reduce((acc, row) => acc + row.revenue, 0);
      setFormulaResult(`df['Revenue'].sum() -> Total Revenue of cohort: $${(sum / 1000).toFixed(1)}B`);
    } else if (fType === 'avg') {
      const avgPE = researchSheet.reduce((acc, row) => acc + row.pe, 0) / researchSheet.length;
      setFormulaResult(`df['P/E Ratio'].mean() -> Mean P/E Multiple: ${avgPE.toFixed(1)}x`);
    } else {
      const positiveCount = researchSheet.filter(r => r.sentiment === 'Bullish').length;
      setFormulaResult(`df.groupby('Sentiment').size() -> Bullish Sentiments: ${positiveCount} of ${researchSheet.length} indicators`);
    }
  };

  // Generate flux image asset
  const generateHeroAsset = () => {
    if (imageGenerating) return;
    setImageGenerating(true);
    setGeneratedImage(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setImageGenerating(false);
        // Using stable placeholder art matching the high-tech prompt description
        setGeneratedImage('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop');
      }
    }, 600);
  };

  return (
    <div 
      className="p-5 min-h-[820px] rounded-xl text-white shadow-2xl transition-all duration-300" 
      style={{
        background: `linear-gradient(165deg, ${COL.charcoal}, ${COL.navy} 75%, #0B1015)`,
        border: `1.5px solid rgba(196,154,108,.3)`,
        fontFamily: 'var(--font-sans), system-ui'
      }}
    >
      {/* Platform Title Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-md text-xs font-bold tracking-widest text-[#15202B]">
              MOA WORKSPACE
            </div>
            <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight mt-1 bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
            Genspark Workspace Orchestrator
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Mixture-of-Agents reasoning workspace & multi-model task broker (Broker-Grade)
          </p>
        </div>

        {/* Real-time telemetry */}
        <div className="flex flex-wrap gap-4 mt-3 md:mt-0 text-[11px] bg-black/35 p-2 px-3.5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 border-r border-white/10 pr-3">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-emerald-400">MoA Stack Active</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase tracking-wider text-[8px]">Token Load</span>
            <span className="font-bold text-white font-mono">{(totalTokens / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase tracking-wider text-[8px]">Agent Queries</span>
            <span className="font-bold text-amber-300 font-mono">{totalQueries} exec</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase tracking-wider text-[8px]">SaaS Cost Saved</span>
            <span className="font-bold text-emerald-400 font-mono">${dollarsSaved.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Commercial vs Open-Source Model Performance Panel */}
      <div className="mb-5 p-4.5 bg-black/25 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Costing & Operational Comparison Ledger</span>
            <h2 className="text-sm font-semibold text-white mt-0.5">Commercial Frontiers vs. Host Savings Index</h2>
          </div>
          <div className="flex gap-1.5 bg-black/45 p-1 rounded-lg border border-white/5 mt-2 sm:mt-0">
            <button
              onClick={() => setModelType('commercial')}
              className={`px-3 py-1 rounded text-xs transition-all ${modelType === 'commercial' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' : 'text-white/40 hover:text-white'}`}
            >
              Commercial Suite
            </button>
            <button
              onClick={() => setModelType('opensource')}
              className={`px-3 py-1 rounded text-xs transition-all ${modelType === 'opensource' ? 'bg-[#3B82F6]/15 text-[#3081F7] border border-[#3B82F6]/20' : 'text-white/40 hover:text-white'}`}
            >
              Open Source Hosted
            </button>
          </div>
        </div>

        {/* Custom SVG Performance charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {CONST_MODELS.filter(m => m.type === modelType).map((m) => (
            <div key={m.name} className="p-3 bg-white/5 border border-white/8 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: m.color }} />
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white font-mono">{m.name}</span>
                <span className="text-[10px] text-white/40">{m.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-black/20 p-1.5 rounded text-center">
                  <div className="text-[9px] text-white/45 uppercase text-left">Input Fee</div>
                  <div className="text-xs font-bold text-white text-left mt-0.5">${m.costPer1M.input.toFixed(2)}<span className="text-[9px] text-white/40">/1M</span></div>
                </div>
                <div className="bg-black/20 p-1.5 rounded text-center">
                  <div className="text-[9px] text-white/45 uppercase text-left">Output Fee</div>
                  <div className="text-xs font-bold text-amber-300 text-left mt-0.5">${m.costPer1M.output.toFixed(2)}<span className="text-[9px] text-white/40">/1M</span></div>
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Throughput ({m.speed} t/s)</span>
                  <span className="font-bold text-white">{m.speed}%</span>
                </div>
                <div className="w-full bg-black/40 h-1 rounded overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (m.speed / 140) * 100)}%` }} />
                </div>
                
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Accuracy Index ({m.accuracyIndex}/100)</span>
                  <span className="font-bold text-white">{m.accuracyIndex}%</span>
                </div>
                <div className="w-full bg-black/40 h-1 rounded overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${m.accuracyIndex}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Orchestration reasoning box */}
      <div className="mb-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Input box */}
        <div className="lg:col-span-4 bg-black/15 border border-white/10 p-4.5 rounded-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400 text-sm" />
              <span className="text-xs font-bold uppercase text-white/80 tracking-wide">Inner-Loop planning agent</span>
            </div>
            
            <textarea
              className="w-full h-32 bg-black/30 text-xs text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 font-sans transition-all"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="What complex mixture-of-agents platform workflow do you plan to analyze?"
            />
            
            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase text-white/30 font-semibold tracking-wider">Example Agent Blueprints:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Multi-model financial scrape & slide builder',
                  'Client lead automation compiler',
                  'Autonomous Docker fullstack code generation'
                ].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => setPromptInput(txt)}
                    className="text-[10px] bg-white/5 border border-white/10 hover:border-amber-500/30 p-1 px-2.5 rounded text-white/75 transition-all w-full text-left truncate"
                  >
                    🚀 {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={triggerOrchestration}
            disabled={orchestrating}
            className={`w-full text-xs font-bold h-10 mt-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              orchestrating
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-[#121921] font-bold shadow-lg shadow-amber-500/10'
            }`}
          >
            {orchestrating ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Orchestrating Mixture-of-Agents...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Trigger Orchestration Agent
              </>
            )}
          </button>
        </div>

        {/* Reasoning Loop Console */}
        <div className="lg:col-span-8 bg-black/35 border border-white/10 p-4.5 rounded-xl flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">ReAct Reasoning Agent & Tool execution log</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase">Telemetry: Active</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {thinkingSteps.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-white/30 text-xs">
                  <Terminal className="w-8 h-8 opacity-30 mb-2" />
                  No reasoning trajectories active. Trigger the agent to compile.
                </div>
              ) : (
                thinkingSteps.map((s, index) => (
                  <div 
                    key={index} 
                    className={`p-2.5 rounded-lg border text-xs leading-relaxed transition-all duration-300 ${
                      s.status === 'active' 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100' 
                        : s.status === 'success'
                        ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300/80'
                        : 'bg-white/3 border-white/5 text-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-cyan-400 animate-ping' : s.status === 'success' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        <span className="font-bold underline tracking-wide uppercase font-mono">{s.agent}</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{s.timestamp}</span>
                    </div>
                    <div>{s.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Model Allocation Percentages under MoA */}
          {thinkingSteps.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Claude Routing', progress: routerProgress.anthropic, color: 'bg-amber-500' },
                { name: 'Gemini Analytica', progress: routerProgress.google, color: 'bg-indigo-500' },
                { name: 'SaaS Logic Loop', progress: routerProgress.openai, color: 'bg-emerald-500' },
                { name: 'Engine Saving', progress: routerProgress.openSource, color: 'bg-sky-500' }
              ].map((r) => (
                <div key={r.name} className="bg-black/25 p-2 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 uppercase block font-semibold">{r.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} transition-all duration-500`} style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white">{r.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LLM as a Judge scorecard */}
          {activeStepIndex >= 4 && (
            <div className="mt-3.5 p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">⚖️ LLM-AS-A-JUDGE TRAJECTORY EVALUATION</span>
                <span className="text-[11px] font-bold text-emerald-400">Total Score: {judgeScore.total}%</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px]">
                <div className="bg-black/35 p-1 px-2.5 rounded text-center">
                  <span className="text-white/40 uppercase block">Security Multiplier</span>
                  <span className="font-mono text-cyan-200">{judgeScore.security}/100</span>
                </div>
                <div className="bg-black/35 p-1 px-2.5 rounded text-center">
                  <span className="text-white/40 uppercase block">Execution Speed</span>
                  <span className="font-mono text-cyan-200">{judgeScore.speed}/100</span>
                </div>
                <div className="bg-black/35 p-1 px-2.5 rounded text-center">
                  <span className="text-white/40 uppercase block">Formatting Spec</span>
                  <span className="font-mono text-cyan-200">{judgeScore.formatting}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Subsystem Switchers */}
      <h3 className="text-xs uppercase font-bold text-[#C49A6C] tracking-wider mb-2 mt-3 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-[#C49A6C]" /> Target Subsystem Workspaces
      </h3>
      <div className="flex overflow-x-auto gap-2 p-1 bg-black/40 border border-white/10 rounded-xl mb-5">
        {[
          { id: 'agent', label: '⚓ Agent Console', color: COL.gold },
          { id: 'developer', label: '💻 AI Developer Sandbox', color: COL.cyan },
          { id: 'research', label: '📊 Deep Research & Sheets', color: COL.emerald },
          { id: 'slides', label: '🎨 AI Slides & Designer', color: COL.purple },
          { id: 'collab', label: '👥 Multiplayer Workspace', color: COL.rose }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSub(sub.id as any)}
            className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all focus:outline-none whitespace-nowrap cursor-pointer"
            style={{
              backgroundColor: activeSub === sub.id ? `${sub.color}15` : 'transparent',
              color: activeSub === sub.id ? sub.color : 'rgba(255,255,255,0.5)',
              border: `1.5px solid ${activeSub === sub.id ? `${sub.color}40` : 'transparent'}`
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Workspace Display Area */}
      <div className="p-4 bg-black/15 border border-white/8 rounded-xl min-h-[440px]">
        
        {/* TAB 1: GENERAL AGENT CONSOLE */}
        {activeSub === 'agent' && (
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-r from-teal-950/10 to-transparent border-l-4 border-[#C49A6C] rounded-r-lg">
              <h4 className="text-sm font-bold text-white mb-1">Mixture-of-Agents Hub Core Protocol</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Here, your orchestrator processes workflows inside the specialized workspaces below. The Task Router measures prompt intent, then routes compiling actions to the IDE stack, tabular searches to the Vector data pipeline, and dynamic designer components to Marp engines. Click any of the workspace tabs to configure individual code sandboxes, SQL builders, and deep crawlers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/8">
                <h5 className="text-xs font-bold uppercase tracking-wide text-amber-300 mb-2">Primary API Credentials Registry</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-black/20 rounded">
                    <span className="text-white/60 font-mono">GEMINI_API_KEY</span>
                    <span className="text-emerald-400 font-bold">● Authenticated</span>
                  </div>
                  <div className="flex justify-between p-2 bg-black/20 rounded">
                    <span className="text-white/60 font-mono">OPENAI_API_KEY</span>
                    <span className="text-emerald-400 font-bold">● Authenticated</span>
                  </div>
                  <div className="flex justify-between p-2 bg-black/20 rounded">
                    <span className="text-white/60 font-mono">ANTHROPIC_API_KEY</span>
                    <span className="text-emerald-400 font-bold">● Authenticated</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/8">
                <h5 className="text-xs font-bold uppercase tracking-wide text-[#C49A6C] mb-2">Autonomous Host Telemetry</h5>
                <p className="text-xs text-white/50 mb-3">
                  Docker containers listen globally. Deploy targets coordinate through high-performance ingress routers.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/35 p-2 rounded">
                    <span className="text-white/40 block text-[9px]">Ingress Host</span>
                    <span className="text-white font-semibold font-mono">0.0.0.0</span>
                  </div>
                  <div className="bg-black/35 p-2 rounded">
                    <span className="text-white/40 block text-[9px]">Sandboxed Port</span>
                    <span className="text-white font-semibold font-mono">3000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI DEVELOPER STANDALONE SANDBOX */}
        {activeSub === 'developer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            
            {/* Left: Code IDE simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between border border-white/10 rounded-xl bg-black/30 overflow-hidden">
              <div>
                <div className="bg-black/40 p-2 border-b border-white/10 flex justify-between items-center">
                  <span className="font-bold text-[10px] uppercase font-mono tracking-wider text-white/70">File Directory / Workspace</span>
                  <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                
                {/* File list clickers */}
                <div className="flex gap-2 p-2 border-b border-white/5 bg-black/15">
                  {devFiles.map(df => (
                    <button
                      key={df.name}
                      onClick={() => setSelectedDevFile(df.name)}
                      className={`px-2.5 py-1 rounded font-mono text-[10px] flex items-center gap-1.5 transition-all focus:outline-none ${selectedDevFile === df.name ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20' : 'text-white/40 hover:text-white'}`}
                    >
                      <FileCode className="w-3 h-3" />
                      {df.name}
                    </button>
                  ))}
                </div>

                {/* Editor Area */}
                <div className="p-3">
                  <textarea
                    onChange={handleEditorChange}
                    className="w-full h-64 bg-black/40 text-xs font-mono p-3 text-cyan-200/90 rounded border border-white/5 focus:outline-none focus:border-cyan-500/45 resize-none"
                    value={editorContent}
                  />
                </div>
              </div>

              {/* SQL DB Designer tool inside IDE */}
              <div className="p-3.5 bg-black/45 border-t border-white/10">
                <span className="text-[10px] font-bold text-[#C49A6C] uppercase tracking-wider block mb-2">Relational PostgreSQL Schema Architect</span>
                <div className="flex gap-1.5 mb-2.5">
                  <input
                    className="flex-1 bg-black/30 text-xs text-white px-2.5 py-1.5 rounded border border-white/10 focus:outline-none focus:border-[#C49A6C]"
                    placeholder="table_name (e.g. leads)"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                  />
                  <button
                    onClick={addDbTable}
                    className="p-1 px-3 bg-[#C49A6C] text-[#121921] font-bold rounded hover:bg-[#D4AE86] transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Table
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[85px] overflow-y-auto">
                  {dbTables.map(t => (
                    <div key={t.name} className="flex flex-col bg-black/30 p-1.5 rounded border border-white/5">
                      <span className="font-mono text-white/80 font-bold font-mono"> {t.name}</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {t.columns.map(c => (
                          <span key={c.name} className="text-[9px] bg-white/5 text-white/50 p-0.5 px-1.5 rounded">{c.name}: {c.type}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sandbox build system console logs */}
            <div className="lg:col-span-7 flex flex-col justify-between border border-white/10 bg-black/25 rounded-xl p-4 overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">Isolated Docker Terminal Environment</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={compileWorkspaceSandbox}
                      disabled={compiling}
                      className="p-1.5 px-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-500/25 transition-all rounded"
                    >
                      {compiling ? 'Building...' : 'Compile & Run Docker'}
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 p-3 h-80 rounded-lg border border-white/5 font-mono text-[10px] text-white/60 space-y-1 overflow-y-auto max-h-[300px]">
                  {devLogs.map((l, idx) => (
                    <div key={idx} className={`${l.startsWith('>>') ? 'text-cyan-400 font-bold' : l.startsWith('Step') ? 'text-amber-300' : 'text-white/60'}`}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Link Outcome */}
              {deployUrl && (
                <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase block tracking-wider">Deploy Successful (Secure Sandboxed Port)</span>
                    <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white hover:underline font-mono inline-flex items-center gap-1 mt-0.5">
                      {deployUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DEEP RESEARCH & SHEETS ENGINE */}
        {activeSub === 'research' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-black/45 border border-white/10 rounded-xl">
              <span className="text-xs font-bold text-amber-300 uppercase block mb-2">Automated Web scraping & Information Crawler</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  className="flex-1 bg-black/30 text-xs text-white px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="Insert research topics for prompt routing queries"
                />
                <button
                  onClick={executeResearchCrawler}
                  disabled={isResearching}
                  className="p-2 px-5 bg-gradient-to-r from-[#C49A6C] to-[#A07840] text-[#121921] font-bold rounded-xl hover:from-[#D4AE86] transition-all"
                >
                  {isResearching ? 'Crawling...' : 'Launch Deep Research'}
                </button>
              </div>

              {/* Scraping logs */}
              {isResearching && (
                <div className="mt-3.5 p-3.5 bg-black/50 rounded-lg border border-white/5 font-mono text-[10px] text-[#C49A6C] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                    <span className="font-bold">STATUS LEDGER:</span> {researchProgress}
                  </div>
                </div>
              )}

              {scrapedUrls.length > 0 && (
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  {scrapedUrls.map((u, i) => (
                    <div key={i} className="bg-black/15 p-2 rounded border border-white/5 flex justify-between items-center">
                      <div className="truncate flex-1 pr-3">
                        <span className="font-bold text-white block truncate">{u.title}</span>
                        <span className="text-white/40 block font-mono truncate">{u.url}</span>
                      </div>
                      <span className={`p-0.5 px-2 rounded font-mono font-bold text-[9px] ${u.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {u.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sheets and Formula Workspace */}
            <div className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-3.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Sheet className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase text-white/80">Pandas Engine Spreadsheet (scraped financials)</span>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => executeFormula('sum')}
                    className="p-1 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[10px] font-bold"
                  >
                    Sum Revenue
                  </button>
                  <button
                    onClick={() => executeFormula('avg')}
                    className="p-1 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[10px] font-bold"
                  >
                    Mean P/E
                  </button>
                  <button
                    onClick={() => executeFormula('sentiment')}
                    className="p-1 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[10px] font-bold"
                  >
                    Sentiment Ratio
                  </button>
                </div>
              </div>

              {/* Python execution log */}
              {formulaResult && (
                <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-lg text-xs flex justify-between items-center">
                  <span className="font-mono text-emerald-300 font-bold">{formulaResult}</span>
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              )}

              {/* Simulated Spreadsheet Ledger */}
              <div className="overflow-x-auto rounded-lg border border-white/15">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-black/45 border-b border-white/15 font-mono text-[10px] text-white/50">
                      <th className="p-2 px-3">SYMBOL</th>
                      <th className="p-2 px-3">COMPANY</th>
                      <th className="p-2 px-3">PRICE ($)</th>
                      <th className="p-2 px-3">REVENUE ($M)</th>
                      <th className="p-2 px-3">P/E MULTIPLE</th>
                      <th className="p-2 px-3">SENTIMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {researchSheet.map((row, idx) => (
                      <tr 
                        key={row.symbol} 
                        className={`border-b border-white/5 hover:bg-white/3 font-mono text-xs ${idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}`}
                      >
                        <td className="p-2 px-3 font-bold text-white">{row.symbol}</td>
                        <td className="p-2 px-3 text-white/70">{row.company}</td>
                        <td className="p-2 px-3">${row.price.toFixed(2)}</td>
                        <td className="p-2 px-3 text-emerald-400 font-bold">${(row.revenue / 1000).toFixed(1)}B</td>
                        <td className="p-2 px-3">{row.pe.toFixed(1)}x</td>
                        <td className="p-2 px-3">
                          <span className={`p-0.5 px-2 rounded-full text-[9px] font-bold ${row.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : row.sentiment === 'Neutral' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {row.sentiment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRESENTATION SLIDES & MARP STACK */}
        {activeSub === 'slides' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            
            {/* Left Hand: Marp markdown editor */}
            <div className="lg:col-span-4 bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-black/25 p-1.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Marp Slides Template</span>
                  <span className="text-[9px] text-[#C49A6C]">Markdown Parser</span>
                </div>
                
                <div className="space-y-1 bg-black/40 p-2.5 rounded border border-white/5 font-mono text-[10px] overflow-y-auto max-h-[180px]">
                  <div>---</div>
                  <div className="text-white font-bold">marp: true</div>
                  <div className="text-white">theme: {slides[activeSlideIndex]?.theme}</div>
                  <div>---</div>
                  <div className="text-purple-300 font-bold"># {slides[activeSlideIndex]?.title}</div>
                  <div className="text-white/80">## {slides[activeSlideIndex]?.subtitle}</div>
                  {slides[activeSlideIndex]?.bullets.map((b, i) => (
                    <div key={i} className="text-white/60 pl-2">- {b}</div>
                  ))}
                </div>
              </div>

              {/* Flux designer image engine */}
              <div className="mt-4 pt-3 border-t border-white/15 space-y-2">
                <span className="text-[10px] font-bold text-[#C49A6C] uppercase tracking-wider block">Flux Pro Visual Asset Engine</span>
                <textarea
                  className="w-full h-16 bg-black/40 text-[10px] text-white p-2 rounded border border-white/10 focus:outline-none focus:border-purple-500 font-sans"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Insert image visual generator parameters"
                />
                <button
                  onClick={generateHeroAsset}
                  disabled={imageGenerating}
                  className="w-full p-2 bg-purple-600/20 border border-purple-500/35 hover:bg-purple-600/30 text-purple-300 font-bold rounded-lg transition-all"
                >
                  {imageGenerating ? 'Generating flux output...' : 'Generate Asset'}
                </button>
              </div>
            </div>

            {/* Right Hand: Canvas renderer panel */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-black/15 border border-white/15 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">Live Render Deck Canvas</span>
                </div>
                
                {/* Visual slide control */}
                <div className="flex gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`w-6 h-6 rounded-md font-bold transition-all text-[11px] ${activeSlideIndex === idx ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/15'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Visual Presentation card wrapper */}
              <div 
                className="w-full h-64 rounded-xl border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 transition-all duration-300"
                style={{
                  background: slides[activeSlideIndex]?.theme === 'minimal'
                    ? `radial-gradient(ellipse at bottom, ${COL.charcoal}, ${COL.navy})`
                    : slides[activeSlideIndex]?.theme === 'executive'
                    ? 'linear-gradient(135deg, #1A1A1A 0%, #202020 100%)'
                    : `linear-gradient(220deg, #0B1015, ${COL.slate} 10%)`,
                  borderLeft: `5px solid ${slides[activeSlideIndex]?.theme === 'technical' ? COL.purple : COL.gold}`
                }}
              >
                <div>
                  <div className="text-[10px] text-[#C49A6C] tracking-widest font-bold uppercase mb-1">Slide {activeSlideIndex + 1} // LATIMORE DECK</div>
                  <h3 className="text-lg font-extrabold tracking-tight text-white leading-tight font-sans">
                    {slides[activeSlideIndex]?.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1.5 font-sans leading-relaxed italic">
                    {slides[activeSlideIndex]?.subtitle}
                  </p>
                </div>

                <div className="space-y-2 my-auto">
                  {slides[activeSlideIndex]?.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-white/80 font-sans">
                      <span className="text-[#C49A6C] font-extrabold mt-0.5">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Sub banner for flux output overlay inside slide */}
                {generatedImage && activeSlideIndex === 1 && (
                  <div className="absolute right-4 bottom-4 w-36 h-24 rounded-lg border border-purple-500/30 overflow-hidden shadow-lg animate-fadeUp">
                    <img src={generatedImage} referrerPolicy="no-referrer" alt="Flux Hero" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-white/30 font-mono">
                  <span>CONFIDENTIAL - BROKER STRATEGY DEMO</span>
                  <span>PAGE {activeSlideIndex + 1} OF 3</span>
                </div>
              </div>

              {/* Flux image generating loader */}
              {imageGenerating && (
                <div className="mt-3.5 p-3 bg-black/45 border border-purple-500/20 rounded-lg text-xs flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                  <span className="font-mono text-purple-300">Evaluating multi-model flux layers. Formulating asset layout...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: MULTIPLAYER WORKSPACE COLLABORATION */}
        {activeSub === 'collab' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            
            {/* Left: multiplayer layout document editor */}
            <div className="lg:col-span-8 flex flex-col justify-between border border-white/10 bg-black/25 rounded-xl p-4 relative overflow-hidden">
              <div 
                ref={workspaceRef}
                onClick={handleWorkspaceClick}
                className="relative min-h-[360px] cursor-crosshair border border-white/5 bg-black/35 rounded-xl p-6 select-none overflow-hidden"
              >
                {/* Title badge */}
                <span className="absolute top-2.5 right-3 text-[9px] font-mono text-white/20 uppercase tracking-widest bg-black/20 p-1 px-2.5 rounded border border-white/5">
                  Multiplayer Sandbox Stage
                </span>

                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#C49A6C] tracking-wide border-b border-white/10 pb-2">MoA Collaborative Protocol Workspace</h4>
                  
                  {/* Text blocks */}
                  <textarea
                    className="w-full h-56 bg-transparent text-xs text-white/90 font-sans border-none focus:outline-none leading-relaxed resize-none"
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                  />
                </div>

                {/* Multi-cursors simulations mapping */}
                {cursors.map((c) => (
                  <div 
                    key={c.name}
                    className="absolute pointer-events-none transition-all duration-[1200ms] ease-out select-none flex flex-col items-start"
                    style={{ left: c.x, top: c.y }}
                  >
                    <div className="flex items-center gap-1 bg-[#121921] px-2 py-0.5 rounded border text-[9px] font-bold shadow-lg" style={{ borderColor: c.color, color: c.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </div>
                    {c.typing && (
                      <div className="mt-1 bg-black/75 p-1 px-2 rounded-md font-mono text-[8px] text-white/60 text-xs border border-white/5 whitespace-nowrap">
                        ✍️ {c.typing}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3.5 flex justify-between items-center text-[10px] text-white/40 font-mono">
                <span>⚡ Clicking coordinates on map registers real-time user workspace positioning</span>
                <span>3 agents active on socket connection</span>
              </div>
            </div>

            {/* Right: websocket ledger stream */}
            <div className="lg:col-span-4 flex flex-col justify-between border border-white/10 bg-black/35 rounded-xl p-4 overflow-hidden">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">Websocket Activity Stream</span>
                </div>

                <div className="bg-black/45 p-3 h-[300px] rounded-lg border border-white/5 font-mono text-[9px] text-white/50 space-y-2 overflow-y-auto max-h-[300px]">
                  {socketLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-white/20">
                      <Activity className="w-6 h-6 mb-1 opacity-20" />
                      Listening for websocket movements...
                    </div>
                  ) : (
                    socketLogs.map((log) => (
                      <div key={log.id} className="border-b border-white/5 pb-1">
                        <div className="flex justify-between text-rose-400 font-bold">
                          <span>[{log.event}]</span>
                          <span className="text-white/30">{log.time}</span>
                        </div>
                        <p className="text-white/70 mt-0.5 font-mono truncate">{log.payload}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setSocketLogs([])}
                className="w-full mt-4 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/20 transition-all rounded-lg text-xs"
              >
                Clear Ledger Stream
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
