
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Banknote, 
  Folders, 
  CheckSquare, 
  Terminal, 
  Mail, 
  School, 
  ShieldCheck, 
  Target, 
  SearchCode, 
  GitBranch, 
  Database, 
  Layout, 
  Sparkles, 
  ChevronRight, 
  Play,
  Workflow,
  FileText,
  Receipt,
  NotebookPen,
  Map as MapIcon,
  Code2,
  Folder,
  CircleCheck,
  Zap,
  Activity,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  HardDrive,
  FilePlus,
  FolderPlus,
  ChevronLeft,
  Share2,
  History,
  ArrowDown,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initAuth, googleSignIn, logout, getAccessToken } from './src/lib/firebase';
import { listDriveFiles, DriveFile } from './src/lib/services/driveService';
import { User as FirebaseUser } from 'firebase/auth';

import { Copilot } from './src/components/Copilot';
import { chatWithCopilot } from './src/lib/services/geminiService';

import { VirtualLaptop } from './src/components/VirtualLaptop';
import { MarketingDashboard } from './src/components/MarketingDashboard';
import { AutonomousMonitor } from './src/components/AutonomousMonitor';
import { WorkflowBuilder } from './src/components/WorkflowBuilder';
import { VeoAnimator } from './src/components/VeoAnimator';
import { AnnuityPlatform } from './src/components/AnnuityPlatform';
import { GensparkWorkspace } from './src/components/GensparkWorkspace';

// Types
type TabType = 'dashboard' | 'revenue' | 'marketing' | 'animator' | 'annuities' | 'genspark' | 'files' | 'drive' | 'tasks' | 'codex' | 'workflows';

interface Task {
  text: string;
  pri: 'high' | 'med' | 'low';
  done: boolean;
}

interface PipelineItem {
  initials: string;
  name: string;
  stage: string;
  cls: string;
  val: string;
}

interface Doc {
  name: string;
  date: string;
  tag: string;
  ico: any;
}

interface LogEntry {
  time: string;
  cls: string;
  msg: string;
}

const COMMON_COMMANDS = ['ls', 'cd', 'mkdir', 'cat', 'echo', 'pwd', 'alias', 'unalias', 'history', 'clear', 'help'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        if (token) setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Dynamic Google Analytics GA4 Loader for NEXT_PUBLIC_MAIN_GA4_ID=G-S0Q3E4DEBJ
    const trackingId = 'G-S0Q3E4DEBJ';
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);
  }, []);

  useEffect(() => {
    if (activeTab === 'drive' && accessToken) {
      fetchDriveFiles();
    }
  }, [activeTab, accessToken]);

  const fetchDriveFiles = async () => {
    if (!accessToken) return;
    setDriveLoading(true);
    setDriveError(null);
    try {
      const files = await listDriveFiles(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      setDriveError(err.message);
    } finally {
      setDriveLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setDriveFiles([]);
    setActiveTab('dashboard');
  };
  const [tasks, setTasks] = useState<Task[]>([
    { text: "Pay PAHS CampusBox balance — $460 DUE TODAY 05/18/2026", pri: "high", done: false },
    { text: "Follow up with Schuylkill Chamber EVP Samantha Chivinski re: Finance & Admin Coordinator role", pri: "high", done: false },
    { text: "Submit LAT-2026-01 pre-suit demand package to Diocese of Allentown", pri: "high", done: false },
    { text: "Review North American carrier appointment paperwork", pri: "med", done: false },
    { text: "Deploy Latimore Hub OS leads dashboard admin page to Vercel", pri: "med", done: false },
    { text: "Activate PAHS Full Circle Legacy QR funnel on latimorelifelegacy.com", pri: "med", done: false },
    { text: "Build Luzerne County Latino market landing page", pri: "low", done: false },
    { text: "Verify GA4 events — G-WZWMX83WXQ and G-S0Q3E4DEBJ", pri: "low", done: false },
  ]);

  const [revOutput, setRevOutput] = useState('Select your ICP, asset type, and KPI — then hit Generate to build on-brand revenue content.');
  const [revLoading, setRevLoading] = useState(false);
  const [taskOutput, setTaskOutput] = useState('');
  const [taskShowOutput, setTaskShowOutput] = useState(false);
  const [codexOutput, setCodexOutput] = useState('');
  const [codexShowOutput, setCodexShowOutput] = useState(false);
  const [dashboardSubTab, setDashboardSubTab] = useState<'kpi' | 'ops'>('kpi');

  // Revenue Engine form state
  const [revIcp, setRevIcp] = useState('Pre-Retirees — Schuylkill County');
  const [revAsset, setRevAsset] = useState('Email campaign');
  const [revNotes, setRevNotes] = useState('');

  // File system creation state
  const [explorerPath, setExplorerPath] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [previewFile, setPreviewFile] = useState<{ name: string; item: FileSystemItem } | null>(null);

  const [terminalLines, setTerminalLines] = useState<string[]>(['Codex Sync v1.2.0 initialized...', 'Connection to medxfhhxvmczmpurkmrp established.', 'Type "help" for a list of commands.']);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalCwd, setTerminalCwd] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draftInput, setDraftInput] = useState<string>('');
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [lastTabPrefix, setLastTabPrefix] = useState('');
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabMatchIndex, setTabMatchIndex] = useState(-1);
  const [cursorCharIndex, setCursorCharIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHistoryPopover, setShowHistoryPopover] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const historyPopoverRef = useRef<HTMLDivElement>(null);
  
  type FileSystemItem = {
    type: 'file' | 'dir';
    content?: string;
    children?: Record<string, FileSystemItem>;
    size?: string;
    modified?: string;
  };

  const [fileSystem, setFileSystem] = useState<Record<string, FileSystemItem>>({
    'readme.md': { 
      type: 'file', 
      content: '# Latimore Hub OS\nStrategic revenue engine powered by Claude.',
      size: '1.2 KB',
      modified: '2026-05-18'
    },
    'config.json': { 
      type: 'file', 
      content: '{\n  "version": "1.0.4",\n  "env": "production"\n}',
      size: '420 B',
      modified: '2026-05-17'
    },
    'src': { 
      type: 'dir', 
      modified: '2026-05-18',
      children: {
        'App.tsx': { 
          type: 'file', 
          content: 'import React from "react";',
          size: '4.8 KB',
          modified: '2026-05-18'
        },
        'components': { 
          type: 'dir', 
          modified: '2026-05-15',
          children: {
            'Terminal.tsx': { 
              type: 'file', 
              content: '// Terminal component',
              size: '2.1 KB',
              modified: '2026-05-15'
            }
          }
        }
      } 
    },
    'docs': { 
      type: 'dir', 
      modified: '2026-05-10',
      children: {
        'policy_template.docx': { type: 'file', size: '24 KB', modified: '2026-05-10' },
        'marketing_plan.pdf': { type: 'file', size: '1.5 MB', modified: '2026-05-08' }
      } 
    }
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines, autoScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyPopoverRef.current && !historyPopoverRef.current.contains(event.target as Node)) {
        setShowHistoryPopover(false);
      }
    };
    if (showHistoryPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistoryPopover]);

  const getDirContents = (path: string[]) => {
    let current: any = { children: fileSystem };
    for (const segment of path) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return null;
      }
    }
    return current.children || {};
  };

  const processCommand = (cmd: string) => {
    const trimmedInput = cmd.trim();
    if (!trimmedInput) return;

    // Save the full input buffer to commandHistory (including newlines)
    setCommandHistory(prev => [trimmedInput, ...prev]);
    setHistoryIndex(-1);

    // Split by newlines to support multi-line commands
    const rawLines = cmd.split('\n');
    let currentLines = [...terminalLines];
    let currentCwd = [...terminalCwd];
    let currentAliases = { ...aliases };

    // Deep clone fileSystem state for local synchronous sequence simulation
    let tempFileSystem = JSON.parse(JSON.stringify(fileSystem));

    const getLocalDirContents = (path: string[]) => {
      let current: any = { children: tempFileSystem };
      for (const segment of path) {
        if (current.children && current.children[segment]) {
          current = current.children[segment];
        } else {
          return null;
        }
      }
      return current.children || {};
    };

    const createLocalFileSystemItem = (name: string, type: 'file' | 'dir', path: string[], content?: string): string | null => {
      // First, trigger the asynchronous state update so that VirtualLaptop file tree also gets it
      const err = createFileSystemItem(name, type, path, content);
      if (err) return err;

      // Mutate local tempFileSystem clone synchronously so subsequent commands in same buffer can read/write
      let curr = tempFileSystem;
      for (const seg of path) {
        if (!curr[seg]) return `Path segment '${seg}' not found`;
        if (curr[seg].type !== 'dir') return `'${seg}' is not a directory`;
        if (!curr[seg].children) curr[seg].children = {};
        curr = curr[seg].children;
      }

      const now = new Date().toISOString().split('T')[0];
      if (type === 'file') {
        curr[name] = { 
          type: 'file', 
          content: content || '', 
          size: content ? `${(content.length / 1024).toFixed(1)} KB` : '0 B',
          modified: now
        };
      } else {
        curr[name] = { 
          type: 'dir', 
          children: {},
          modified: now
        };
      }
      return null;
    };

    for (const rawLine of rawLines) {
      if (rawLine.trim() === '') {
        // If empty line, we print the prompt line but do not execute any command
        currentLines.push(`> `);
        continue;
      }

      // Check aliases for this line
      let finalCmd = rawLine.trim();
      const firstWord = finalCmd.split(/\s+/)[0];
      if (currentAliases[firstWord]) {
        finalCmd = currentAliases[firstWord] + finalCmd.slice(firstWord.length);
      }

      const args = finalCmd.trim().split(/\s+/);
      const command = args[0].toLowerCase();
      let output = '';

      const currentDir = getLocalDirContents(currentCwd);

      switch (command) {
        case 'help':
          output = `Available commands: ${COMMON_COMMANDS.join(', ')}`;
          break;
        case 'alias':
          if (!args[1]) {
            output = Object.entries(currentAliases).length > 0 
              ? Object.entries(currentAliases).map(([k, v]) => `${k}='${v}'`).join('\n')
              : 'No aliases defined';
          } else {
            const aliasMatch = args.slice(1).join(' ').match(/^([a-zA-Z0-9_-]+)=(.+)$/);
            if (aliasMatch) {
              const key = aliasMatch[1];
              const value = aliasMatch[2].replace(/^['"](.*)['"]$/, '$1');
              currentAliases[key] = value;
              output = `Alias created: ${key}='${value}'`;
            } else {
              output = "Usage: alias name=command (e.g. alias l=ls)";
            }
          }
          break;
        case 'unalias':
          if (!args[1]) {
            output = 'unalias: missing operand';
          } else {
            const name = args[1];
            if (currentAliases[name]) {
              delete currentAliases[name];
              output = `Alias removed: ${name}`;
            } else {
              output = `unalias: ${name}: not found`;
            }
          }
          break;
        case 'history': {
          const updatedHistory = [trimmedInput, ...commandHistory];
          output = [...updatedHistory].reverse().map((c, i) => `  ${i + 1}  ${c}`).join('\n');
          break;
        }
        case 'ls':
          if (!currentDir) {
             output = 'ls: cannot access directory';
          } else {
             output = Object.entries(currentDir)
              .map(([name, item]) => item.type === 'dir' ? `${name}/` : name)
              .join('  ');
          }
          break;
        case 'cd':
          if (!args[1] || args[1] === '~') {
            currentCwd = [];
          } else if (args[1] === '..') {
            currentCwd = currentCwd.slice(0, -1);
          } else if (args[1] === '.') {
            // Stay here
          } else {
            if (!currentDir) {
              output = `cd: ${args[1]}: No such directory`;
            } else {
              const target = currentDir[args[1]];
              if (target && target.type === 'dir') {
                currentCwd = [...currentCwd, args[1]];
              } else {
                output = `cd: ${args[1]}: No such directory`;
              }
            }
          }
          break;
        case 'mkdir':
          if (!args[1]) {
            output = 'mkdir: missing operand';
          } else {
            const mkdirErr = createLocalFileSystemItem(args[1], 'dir', currentCwd);
            output = mkdirErr || `Directory '${args[1]}' created`;
          }
          break;
        case 'cat':
          if (!args[1]) {
            output = 'cat: missing operand';
          } else if (!currentDir) {
            output = `cat: ${args[1]}: No such file`;
          } else if (currentDir[args[1]]) {
            const item = currentDir[args[1]];
            output = item.type === 'file' ? (item.content || '') : `cat: ${args[1]}: Is a directory`;
          } else {
            output = `cat: ${args[1]}: No such file`;
          }
          break;
        case 'echo': {
          const echoMatch = rawLine.match(/echo\s+"([^"]*)"\s+>\s+([^\s]+)/);
          if (echoMatch) {
            const content = echoMatch[1];
            const filename = echoMatch[2];
            const echoErr = createLocalFileSystemItem(filename, 'file', currentCwd, content);
            output = echoErr || `Written to ${filename}`;
          } else {
            const plainEchoMatch = rawLine.match(/^echo\s+(.+)$/i);
            if (plainEchoMatch) {
              output = plainEchoMatch[1].replace(/^["']|["']$/g, '');
            } else {
              output = '';
            }
          }
          break;
        }
        case 'clear':
          currentLines = [];
          output = '';
          break;
        case 'pwd':
          output = '/' + currentCwd.join('/');
          break;
        default:
          output = `command not found: ${command}`;
      }

      if (command === 'clear') {
        // Skip adding the prompt of clear
      } else {
        currentLines.push(`> ${rawLine}`);
        if (output) {
          currentLines.push(output);
        }
      }
    }

    setTerminalLines(currentLines);
    setTerminalCwd(currentCwd);
    setAliases(currentAliases);
    setTerminalInput('');
  };

  const handleSelectSuggestion = (match: string) => {
    const input = terminalInput;
    const trimmedLeft = input.trimStart();
    const parts = trimmedLeft.split(/\s+/);
    const isCommand = parts.length <= 1;
    const prefixPath = parts.slice(0, -1).join(' ');

    let newInput = '';
    if (isCommand) {
      newInput = match;
    } else {
      newInput = prefixPath ? `${prefixPath} ${match}` : match;
    }

    setTerminalInput(newInput);
    setCursorCharIndex(newInput.length);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newInput.length, newInput.length);
      }
    }, 10);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Escape') {
      setLastTabPrefix('');
      setTabMatches([]);
      setTabMatchIndex(-1);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();

      let activePrefix = lastTabPrefix;
      let activeMatches = tabMatches;
      let activeIndex = tabMatchIndex;

      const input = terminalInput;
      const trimmedLeft = input.trimStart();
      const parts = trimmedLeft.split(/\s+/);
      const isCommand = parts.length <= 1;
      const currentWord = parts[parts.length - 1] || '';
      const prefixPath = parts.slice(0, -1).join(' ');

      if (activePrefix === '' || activeMatches.length === 0) {
        // We are NOT actively cycling, so look up matches for the first time
        activePrefix = currentWord;
        let candidates: string[] = [];

        if (isCommand) {
          // Filter COMMON_COMMANDS based on currentWord prefix
          candidates = COMMON_COMMANDS.filter(cmd => cmd.toLowerCase().startsWith(currentWord.toLowerCase()));
        } else {
          // File completion in current directory
          const currentDir = getDirContents(terminalCwd);
          if (currentDir) {
            candidates = Object.entries(currentDir)
              .map(([name, item]) => item.type === 'dir' ? `${name}/` : name)
              .filter(name => name.toLowerCase().startsWith(currentWord.toLowerCase()));
          }
        }

        if (candidates.length > 0) {
          activeMatches = candidates;
          activeIndex = 0;
          setLastTabPrefix(currentWord);
          setTabMatches(candidates);
          setTabMatchIndex(0);

          if (candidates.length > 1) {
            setTerminalLines(prev => [...prev, `Suggestions: ${candidates.join('  ')}`]);
          }
        } else {
          return;
        }
      } else {
        // We ARE cycling!
        activeIndex = (activeIndex + 1) % activeMatches.length;
        setTabMatchIndex(activeIndex);
      }

      const matchedWord = activeMatches[activeIndex];
      let newInput = '';
      if (isCommand) {
        newInput = matchedWord;
      } else {
        newInput = prefixPath ? `${prefixPath} ${matchedWord}` : matchedWord;
      }
      setTerminalInput(newInput);
      setCursorCharIndex(newInput.length);
      return;
    }

    // Reset tab cycle on other keys (except modifier keys)
    if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      setLastTabPrefix('');
      setTabMatches([]);
      setTabMatchIndex(-1);
    }

    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter inserts newline natively, do nothing
      } else {
        // Enter processes the full command buffer on Enter
        e.preventDefault();
        processCommand(terminalInput);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        let nextIndex = historyIndex;
        if (historyIndex === -1) {
          setDraftInput(terminalInput);
          nextIndex = 0;
        } else if (historyIndex < commandHistory.length - 1) {
          nextIndex = historyIndex + 1;
        }
        setHistoryIndex(nextIndex);
        setTerminalInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setTerminalInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput(draftInput);
      }
    }
  };

  const createFileSystemItem = (name: string, type: 'file' | 'dir', path: string[], content?: string, allowOverwrite = false): string | null => {
    if (!name) return 'Missing name';
    if (name.includes('/') || name.includes('\\')) return 'Invalid characters in name';
    
    // Simulate permission denied for 'src' folder
    if (path[0] === 'src') {
      return 'Permission denied: src is read-only';
    }

    const now = new Date().toISOString().split('T')[0];
    let error: string | null = null;

    setFileSystem(prev => {
      const newFs = { ...prev };
      let curr = newFs;
      
      for (const seg of path) {
        if (!curr[seg]) {
          error = `Path segment '${seg}' not found`;
          return prev;
        }
        if (curr[seg].type !== 'dir') {
          error = `'${seg}' is not a directory`;
          return prev;
        }
        if (!curr[seg].children) curr[seg].children = {};
        curr = curr[seg].children!;
      }
      
      if (curr[name]) {
        if (type === 'file' && allowOverwrite) {
          curr[name] = {
            ...curr[name],
            content: content || '',
            size: content ? `${(content.length / 1024).toFixed(1)} KB` : '0 B',
            modified: now
          };
          return newFs;
        }
        error = `Already exists: ${name}`;
        return prev;
      }

      if (type === 'file') {
        curr[name] = { 
          type: 'file', 
          content: content || '', 
          size: content ? `${(content.length / 1024).toFixed(1)} KB` : '0 B',
          modified: now
        };
      } else {
        curr[name] = { 
          type: 'dir', 
          children: {},
          modified: now
        };
      }
      return newFs;
    });

    return error;
  };

  const getFileIcon = (name: string, type: 'file' | 'dir') => {
    if (type === 'dir') return <Folder className="text-[#C49A6C]" size={18} />;
    
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code2 className="text-blue-500" size={18} />;
      case 'json':
        return <Database className="text-amber-500" size={18} />;
      case 'md':
        return <FileText className="text-slate-500" size={18} />;
      case 'pdf':
        return <FileText className="text-red-500" size={18} />;
      case 'docx':
        return <FileText className="text-blue-600" size={18} />;
      case 'csv':
        return <Database className="text-emerald-500" size={18} />;
      default:
        return <FileText className="text-slate-400" size={18} />;
    }
  };

  const pipeline: PipelineItem[] = [
    { initials: "SP", name: "Schuylkill Pre-Retiree", stage: "Quote", cls: "quote", val: "$4,800/yr" },
    { initials: "YF", name: "Young Family — Frackville", stage: "Lead", cls: "lead", val: "$1,200/yr" },
    { initials: "SV", name: "Schuylkill Valley SD", stage: "Active Prospect", cls: "active", val: "$18,000/yr" },
    { initials: "RC", name: "Referral — Coal Region", stage: "Closing", cls: "close", val: "$2,400/yr" },
  ];

  const docs: Doc[] = [
    { name: "LAT-2026-01 Final Civil Complaint", date: "May 2026", tag: "Legal", ico: FileText },
    { name: "Schuylkill Chamber Cover Letter & Resume", date: "Apr 2026", tag: "Career", ico: NotebookPen },
    { name: "PAHS Full Circle Sponsorship Invoice", date: "Apr 2026", tag: "Sponsorship", ico: Receipt },
    { name: "MBA Diploma — AIU Apr 7 2026", date: "Apr 2026", tag: "Credentials", ico: ShieldCheck },
    { name: "Latino Market Playbook — Luzerne County", date: "Apr 2026", tag: "Marketing", ico: MapIcon },
    { name: "Hub OS Vercel deploy config", date: "May 2026", tag: "Code", ico: Code2 },
  ];

  const logs: LogEntry[] = [
    { time: "09:14", cls: "text-emerald-400", msg: "✓ Latimore Hub OS — Vercel build passed" },
    { time: "09:10", cls: "text-blue-400", msg: "→ Supabase medxfhhxvmczmpurkmrp — schema sync OK" },
    { time: "08:55", cls: "text-emerald-400", msg: "✓ GA4 G-WZWMX83WXQ — events firing correctly" },
    { time: "08:40", cls: "text-amber-400", msg: "⚠ PAHS invoice $460 — DUE TODAY 05/18/2026" },
    { time: "08:30", cls: "text-blue-400", msg: "→ Brand guardrails loaded — all workflows active" },
    { time: "Yesterday", cls: "text-emerald-400", msg: "✓ LAT-2026-01 complaint package — finalized" },
  ];

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const handleLaunchWorkflow = (title: string, prompt: string) => {
    navigator.clipboard.writeText(prompt).catch(() => {});
    alert(`Prompt copied to clipboard! Paste it into Claude.ai to run this workflow.\n\n— ${title.toUpperCase()}`);
  };

  const handleOpenFolder = (title: string, prompt: string) => {
    navigator.clipboard.writeText(prompt).catch(() => {});
    alert(`Folder prompt copied! Paste into Claude.ai to explore this folder.\n\n— ${title.toUpperCase()}`);
  };

  const runRevenueAI = async () => {
    setRevLoading(true);
    setRevOutput('Connecting to Latimore Brand Engine...');
    try {
      const prompt = `Generate a ${revAsset} for target ICP: ${revIcp}. 
      Additional Notes: ${revNotes || 'None'}. 
      Ensure the tone matches the Latimore Life & Legacy brand: "Protecting Today. Securing Tomorrow. #TheBeatGoesOn".`;
      
      const response = await chatWithCopilot(prompt, []);
      setRevOutput(response.content);
    } catch (err: any) {
      setRevOutput(`Error generating content: ${err.message}`);
    } finally {
      setRevLoading(false);
    }
  };

  const runTaskAI = () => {
    setTaskShowOutput(true);
    setTaskOutput('Analyzing priorities based on current deadlines...');
  };

  const runCodexAI = () => {
    setCodexShowOutput(true);
    setCodexOutput('Scanning codebase for architectural consistency and deployment readiness...');
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1] text-[#1a1a1a] p-4 flex flex-col items-center">
      <div className="w-full max-w-[960px] flex flex-col">
        {/* Topbar */}
        <header className="bg-[#2C3E50] rounded-t-[10px] p-3 px-4.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-[#C49A6C] rounded-t-lg rounded-b-[13px] flex items-center justify-center font-bold text-[#2C3E50] text-sm tracking-tighter">
              LL
            </div>
            <div>
              <div className="text-white text-sm font-semibold leading-tight">Latimore Hub OS</div>
              <div className="text-[#C49A6C] text-[11px]">Revenue & Operations Command Center</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></div>
            <span className="text-[11px] text-white/55">Claude + Codex Live</span>
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <img src={user.photoURL || ''} alt="avatar" className="w-5 h-5 rounded-full border border-[#C49A6C]/50" referrerPolicy="no-referrer" />
                <button onClick={handleLogout} className="text-white/50 hover:text-[#C49A6C] transition-colors"><LogOut size={12} /></button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-[#C49A6C] text-[#2C3E50] text-[10px] font-bold px-2 py-1 rounded transition-all hover:bg-[#E8D5B7] ml-2"
              >
                SIGN IN
              </button>
            )}
            <span className="text-[11px] text-[#C49A6C] bg-[#C49A6C]/15 rounded-full px-2.5 py-1 ml-1">05/18/2026</span>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-x border-[rgba(44,62,80,0.12)] flex flex-wrap shadow-sm">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'revenue', label: 'Revenue Engine', icon: Banknote },
            { id: 'annuities', label: 'Annuity Platform', icon: ShieldCheck },
            { id: 'genspark', label: 'Genspark Workspace', icon: Sparkles },
            { id: 'marketing', label: 'Marketing Hub', icon: Share2 },
            { id: 'animator', label: 'Veo Video Studio', icon: Video },
            { id: 'files', label: 'Local Files', icon: Folders },
            { id: 'drive', label: 'Google Drive', icon: HardDrive },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'codex', label: 'Codex Sync', icon: Terminal },
            { id: 'workflows', label: 'Workflow Studio', icon: Workflow },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs transition-all duration-150 relative ${
                activeTab === tab.id 
                  ? 'text-[#2C3E50] font-semibold bg-[#fdfcfa]' 
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f8f7f5]'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#C49A6C]" />
              )}
            </button>
          ))}
        </nav>

        {/* Panels */}
        <main className="bg-white border border-[rgba(44,62,80,0.12)] border-top-0 rounded-b-[10px] p-4.5 min-h-[420px] shadow-md">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4.5"
              >
                {/* Sub-tab Toolbar selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(44,62,80,0.08)] pb-3.5 mb-2 gap-3">
                  <div className="flex bg-[#f2effa]/70 p-1 rounded-md border border-[rgba(44,62,80,0.06)]">
                    <button
                      onClick={() => setDashboardSubTab('kpi')}
                      className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                        dashboardSubTab === 'kpi'
                          ? 'bg-white text-[#2C3E50] shadow-sm font-semibold'
                          : 'text-[#6b6b6b] hover:text-[#2C3E50]'
                      }`}
                    >
                      <Sparkles size={11} className="text-[#C49A6C]" /> Strategic KPI Hub
                    </button>
                    <button
                      onClick={() => setDashboardSubTab('ops')}
                      className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                        dashboardSubTab === 'ops'
                          ? 'bg-white text-[#2C3E50] shadow-sm font-semibold'
                          : 'text-[#6b6b6b] hover:text-[#2C3E50]'
                      }`}
                    >
                      <Activity size={11} className="text-[#C49A6C]" /> Autonomous Systems Monitor
                    </button>
                  </div>
                  <div className="font-mono text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5 bg-slate-50 p-1.5 px-2.5 rounded border border-slate-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Orchestrated Node: <span className="text-emerald-600 font-extrabold">Active</span>
                  </div>
                </div>

                {dashboardSubTab === 'ops' ? (
                  <AutonomousMonitor />
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      {[
                        { label: 'Active Policies', val: '1', sub: 'Target: 5/mo by Mo.12', warn: true },
                        { label: 'Pipeline Value', val: '$26.4K', sub: '4 active prospects', ok: true },
                        { label: 'Referral Rate', val: '12%', sub: 'Target: 20–30%', warn: true },
                        { label: 'District Contacts', val: '1', sub: 'Target: 3–5 by Mo.12', warn: true },
                      ].map((kpi, i) => (
                        <div key={i} className="bg-[#f9f8f6] rounded-md p-3 px-3.5 border border-[rgba(44,62,80,0.12)]">
                          <div className="text-[11px] text-[#6b6b6b] mb-1">{kpi.label}</div>
                          <div className="text-[22px] font-bold text-[#2C3E50]">{kpi.val}</div>
                          <div className={`text-[11px] mt-0.5 ${kpi.warn ? 'text-[#b37400]' : 'text-[#3d8b5a]'}`}>{kpi.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Quick-launch workflows</h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#e8d5b7] text-[#8b6a45]">#TheBeatGoesOn</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        { 
                          id: 'email', 
                          title: 'Email Campaign Builder', 
                          desc: 'On-brand emails for pre-retirees, families, or school districts. KPI-aligned CTAs auto-generated.',
                          icon: Mail,
                          prompt: "Run the Latimore brand content builder: create an on-brand email campaign for Pre-Retirees in Schuylkill County..."
                        },
                        { 
                          id: 'proposal', 
                          title: 'District Proposal Builder', 
                          desc: 'Full school district B2B proposals covering risk, continuity, and community trust.',
                          icon: School,
                          prompt: "Run the school district proposal builder for a Schuylkill County district..."
                        },
                        { 
                          id: 'brand-check', 
                          title: 'Brand Compliance Check', 
                          desc: 'Paste any draft. Returns a scored report against guardrails with a priority fix list.',
                          icon: ShieldCheck,
                          prompt: "Run a Latimore brand compliance review. I will paste a draft asset below..."
                        },
                        { 
                          id: 'cta', 
                          title: 'CTA Generator', 
                          desc: 'Generate KPI-linked calls to action for any ICP, channel, or campaign goal.',
                          icon: Target,
                          prompt: "Run the KPI-aligned CTA generator for Latimore Life & Legacy LLC..."
                        },
                      ].map((wf) => (
                        <div 
                          key={wf.id} 
                          onClick={() => handleLaunchWorkflow(wf.title, wf.prompt)}
                          className="border border-[rgba(44,62,80,0.12)] rounded-md p-3.5 cursor-pointer hover:border-[#C49A6C] hover:shadow-[0_2px_8px_rgba(196,154,108,0.15)] transition-all bg-white"
                        >
                          <div className="w-8.5 h-8.5 rounded-lg bg-[#E8D5B7] flex items-center justify-center mb-2 text-[#8B6A45]">
                            <wf.icon size={17} />
                          </div>
                          <div className="text-[12px] font-semibold mb-0.5">{wf.title}</div>
                          <div className="text-[11px] text-[#6b6b6b] leading-relaxed">{wf.desc}</div>
                          <div className="mt-2 text-[11px] text-[#8B6A45] font-medium flex items-center gap-1">
                            <Play size={10} fill="currentColor" /> Launch in Claude ↗
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[13px] font-semibold pt-1">Today's priorities</div>
                    <div className="space-y-0 relative">
                      {tasks.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[rgba(44,62,80,0.12)] last:border-b-0 group">
                          <button 
                            onClick={() => toggleTask(i)}
                            className={`w-4 h-4 rounded-[4px] border-[1.5px] mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                              t.done ? 'bg-[#2C3E50] border-[#2C3E50]' : 'border-[rgba(44,62,80,0.12)]'
                            }`}
                          >
                            {t.done && <CircleCheck size={10} className="text-white" />}
                          </button>
                          <div className={`text-[12px] flex-1 leading-relaxed ${t.done ? 'text-[#9a9a9a] line-through' : 'text-[#1a1a1a]'}`}>
                            {t.text}
                          </div>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                            t.pri === 'high' ? 'bg-[#fdd] text-[#b33030]' : 
                            t.pri === 'med' ? 'bg-[#fff3d4] text-[#b37400]' : 'bg-[#d4edda] text-[#3d8b5a]'
                          }`}>
                            {t.pri}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'revenue' && (
              <motion.div
                key="revenue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold">Revenue pipeline</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ddeeff] text-[#1a6fa8]">Coal Region</span>
                </div>
                
                <div className="space-y-0">
                  {pipeline.map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-[rgba(44,62,80,0.12)] last:border-b-0">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f9f8f6] border border-[rgba(44,62,80,0.12)] flex items-center justify-center text-[11px] font-semibold text-[#6b6b6b]">
                        {p.initials}
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-semibold">{p.name}</div>
                        <div className="text-[11px] text-[#6b6b6b]">{p.stage}</div>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.cls === 'quote' ? 'bg-[#ddeeff] text-[#1a6fa8]' :
                        p.cls === 'lead' ? 'bg-[#fff3d4] text-[#b37400]' :
                        p.cls === 'active' ? 'bg-[#e8d5b7] text-[#8b6a45]' : 'bg-[#d4edda] text-[#3d8b5a]'
                      }`}>
                        {p.stage}
                      </span>
                      <div className="text-[12px] font-semibold text-[#8B6A45]">{p.val}</div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[rgba(44,62,80,0.12)] my-3" />

                <h3 className="text-[13px] font-semibold">AI revenue content engine</h3>
                <div className="border border-[rgba(44,62,80,0.12)] rounded-md overflow-hidden">
                  <div className="bg-[#2C3E50] p-2 px-3 flex items-center gap-2 text-[#C49A6C] text-[11px] font-semibold">
                    <Sparkles size={12} /> Latimore Brand Content Builder — Powered by Claude
                  </div>
                  <div className="bg-[#f9f8f6] p-3 flex flex-wrap gap-2 border-b border-[rgba(44,62,80,0.12)]">
                    <select 
                      value={revIcp}
                      onChange={(e) => setRevIcp(e.target.value)}
                      className="flex-1 min-w-[120px] text-[12px] p-1.5 px-2 bg-white rounded border border-[rgba(44,62,80,0.12)] cursor-pointer outline-none"
                    >
                      <option>Pre-Retirees — Schuylkill County</option>
                      <option>Young Families — Coal Region</option>
                      <option>School Districts — Schuylkill</option>
                      <option>Latino Market — Luzerne County</option>
                    </select>
                    <select 
                      value={revAsset}
                      onChange={(e) => setRevAsset(e.target.value)}
                      className="flex-1 min-w-[120px] text-[12px] p-1.5 px-2 bg-white rounded border border-[rgba(44,62,80,0.12)] cursor-pointer outline-none"
                    >
                      <option>Email campaign</option>
                      <option>Social post</option>
                      <option>One-page flyer</option>
                      <option>Follow-up phone script</option>
                      <option>Landing page copy</option>
                      <option>Referral request message</option>
                    </select>
                  </div>
                  <div className="bg-white p-3 flex gap-2">
                    <textarea 
                      value={revNotes}
                      onChange={(e) => setRevNotes(e.target.value)}
                      className="flex-1 bg-[#f9f8f6] text-[12px] p-2 h-14 rounded border border-[rgba(44,62,80,0.12)] resize-none outline-none focus:border-[#C49A6C]"
                      placeholder="Optional: add a specific angle, product, event, or compliance note..."
                    />
                    <button 
                      onClick={runRevenueAI}
                      disabled={revLoading}
                      className="bg-[#2C3E50] text-white px-4 text-xs font-semibold rounded-md hover:bg-[#3d5166] transition-colors disabled:opacity-50"
                    >
                      {revLoading ? '...' : 'Generate ↗'}
                    </button>
                  </div>
                  <div className="p-3 bg-[#fafaf8] border-t border-[rgba(44,62,80,0.12)] min-h-[52px]">
                    <p className="text-[12px] text-[#6b6b6b] leading-relaxed whitespace-pre-wrap">{revOutput}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <VirtualLaptop 
                  fileSystem={fileSystem}
                  explorerPath={explorerPath}
                  selectedFileName={previewFile?.name}
                  setExplorerPath={setExplorerPath}
                  createFileSystemItem={(name, type, path, content) => {
                    const res = createFileSystemItem(name, type, path, content);
                    // Optionally notify agent if needed
                    return res;
                  }}
                  onFileSelect={(name, item) => setPreviewFile({ name, item })}
                />

                <AnimatePresence>
                  {previewFile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                      onClick={() => setPreviewFile(null)}
                    >
                      <motion.div 
                        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-[rgba(44,62,80,0.12)]"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="bg-[#2C3E50] p-3 px-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFileIcon(previewFile.name, 'file')}
                            <span className="text-white text-xs font-semibold">{previewFile.name}</span>
                          </div>
                          <button 
                            onClick={() => setPreviewFile(null)}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            <LogOut size={16} />
                          </button>
                        </div>
                        <div className="bg-[#1a1f2e] p-4 font-mono text-xs leading-relaxed overflow-y-auto max-h-[60vh] text-slate-300">
                          {previewFile.item.content ? (
                            <pre className="whitespace-pre-wrap">{previewFile.item.content}</pre>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                              <FileText size={48} className="mb-4 opacity-20" />
                              <p>No text content available to preview.</p>
                              <p className="text-[10px] mt-1">File Size: {previewFile.item.size || 'Unknown'}</p>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-[#f9f8f6] border-t border-[rgba(44,62,80,0.12)] flex items-center justify-between text-[10px] text-[#6b6b6b]">
                          <span>Ref: {explorerPath.join('/')}/{previewFile.name}</span>
                          <span>Last Modified: {previewFile.item.modified}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="text-[13px] font-semibold pt-1">Recent local activity</h3>
                <div className="space-y-0">
                  {docs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[rgba(44,62,80,0.12)] last:border-b-0 group">
                      <doc.ico size={15} className="text-[#6b6b6b] shrink-0" />
                      <div className="text-[12px] flex-1 truncate group-hover:text-[#C49A6C] transition-colors">{doc.name}</div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f4f1] border border-[rgba(44,62,80,0.12)] text-[#6b6b6b]">
                        {doc.tag}
                      </span>
                      <div className="text-[11px] text-[#9a9a9a] ml-2 shrink-0">{doc.date}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'drive' && (
              <motion.div
                key="drive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-[13px] font-semibold flex items-center gap-2">
                     <HardDrive size={16} className="text-[#4285F4]" />
                     Google Drive Explorer
                   </h3>
                   {!user && (
                     <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                       Sign in required
                     </span>
                   )}
                </div>

                {!user ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[rgba(44,62,80,0.12)] rounded-lg bg-[#f9f8f6]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <HardDrive size={32} className="text-[#4285F4]" />
                    </div>
                    <h4 className="text-sm font-semibold mb-2">Connect your Google Drive</h4>
                    <p className="text-xs text-[#6b6b6b] mb-6 text-center max-w-[300px]">
                      Securely access your client records, policies, and carrier documents directly from Drive.
                    </p>
                    <button 
                      onClick={handleLogin}
                      className="flex items-center gap-3 bg-white border border-[rgba(44,62,80,0.12)] px-4 py-2 rounded-md hover:bg-slate-50 transition-all font-medium text-sm shadow-sm"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.7l2.91 2.26c1.71-1.57 2.69-3.89 2.69-6.59z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.85-3.05.85-2.35 0-4.33-1.58-5.04-3.71L.93 13.43C2.42 16.14 5.48 18 9 18z"/>
                        <path fill="#FBBC05" d="M3.96 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.57H.93C.34 5.6.01 6.77.01 8s.33 2.4.92 3.43l3.03-2.73z"/>
                        <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.45 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.48 0 2.42 1.86.93 4.57l3.03 2.73c.71-2.13 2.69-3.72 5.04-3.72z"/>
                      </svg>
                      Sign In with Google
                    </button>
                  </div>
                ) : driveLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-[#6b6b6b] mt-3">Syncing with Google Drive...</span>
                  </div>
                ) : driveError ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs">
                    Error loading Drive files: {driveError}
                    <button onClick={fetchDriveFiles} className="ml-2 underline font-bold">Retry</button>
                  </div>
                ) : (
                  <div className="space-y-0 border border-[rgba(44,62,80,0.12)] rounded-md overflow-hidden bg-white">
                    <div className="bg-[#f9f8f6] p-2 px-3 flex items-center justify-between border-b border-[rgba(44,62,80,0.12)] text-[11px] font-semibold text-[#6b6b6b]">
                      <span>Filename</span>
                      <div className="flex gap-10">
                        <span>Modified</span>
                        <span className="w-16">Action</span>
                      </div>
                    </div>
                    {driveFiles.length === 0 ? (
                      <div className="p-8 text-center text-[#9a9a9a] text-xs">
                        No files found in your Google Drive root.
                      </div>
                    ) : (
                      driveFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-[#fcfbf9] transition-colors border-b border-[rgba(44,62,80,0.12)] last:border-b-0 group">
                           <div className={`p-1.5 rounded bg-blue-50 text-blue-600`}>
                             {file.mimeType.includes('folder') ? <Folder size={16} /> : <FileText size={16} />}
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="text-[12px] font-semibold truncate text-[#2C3E50]">{file.name}</div>
                             <div className="text-[10px] text-[#9a9a9a]">{file.mimeType.split('.').pop()}</div>
                           </div>
                           <div className="text-[11px] text-[#9a9a9a] mr-4 hidden sm:block">
                             {new Date(file.modifiedTime).toLocaleDateString()}
                           </div>
                           <button className="p-1.5 hover:bg-[#2C3E50]/10 rounded text-[#C49A6C] transition-colors">
                             <ExternalLink size={14} />
                           </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {user && (
                  <div className="h-px bg-[rgba(44,62,80,0.12)] my-2" />
                )}

                {user && (
                  <div className="border border-[rgba(44,62,80,0.12)] rounded-md overflow-hidden bg-[#fafaf8]">
                     <div className="bg-[#2C3E50] p-2 px-3 flex items-center gap-2 text-[#C49A6C] text-[11px] font-semibold">
                       <Sparkles size={12} /> Drive Assistant — Claude
                     </div>
                     <div className="p-3 flex gap-2">
                       <textarea 
                          className="flex-1 bg-white text-[12px] p-2 h-12 rounded border border-[rgba(44,62,80,0.12)] resize-none outline-none focus:border-[#C49A6C]"
                          placeholder="Ask Claude to find a specific policy, summarize a document in Drive, or organize your folders..."
                       />
                       <button className="bg-[#2C3E50] text-white px-5 text-xs font-semibold rounded-md hover:bg-[#3d5166] transition-colors">
                         Ask ↗
                       </button>
                     </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-[13px] font-semibold">Active tasks</h3>
                   <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fdfcfa] border border-[#2C3E50]/10">
                     {tasks.filter(t => !t.done).length} open
                   </span>
                </div>

                <div className="space-y-0 border border-[rgba(44,62,80,0.12)] rounded-md divide-y divide-[rgba(44,62,80,0.12)] overflow-hidden">
                  {tasks.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white hover:bg-[#fcfbf9] transition-colors group">
                       <button 
                         onClick={() => toggleTask(i)}
                         className={`w-4 h-4 rounded-[4px] border-[1.5px] mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                           t.done ? 'bg-[#2C3E50] border-[#2C3E50]' : 'border-[rgba(44,62,80,0.12)] group-hover:border-[#C49A6C]'
                         }`}
                       >
                         {t.done && <CircleCheck size={10} className="text-white" />}
                       </button>
                       <div className={`text-[12px] flex-1 leading-relaxed ${t.done ? 'text-[#9a9a9a] line-through' : 'text-[#1a1a1a]'}`}>
                         {t.text}
                       </div>
                       <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                         t.pri === 'high' ? 'bg-[#fdd] text-[#b33030]' : 
                         t.pri === 'med' ? 'bg-[#fff3d4] text-[#b37400]' : 'bg-[#d4edda] text-[#3d8b5a]'
                       }`}>
                         {t.pri}
                       </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[rgba(44,62,80,0.12)] my-2" />

                <div className="border border-[rgba(44,62,80,0.12)] rounded-md overflow-hidden bg-[#fafaf8]">
                   <div className="bg-[#2C3E50] p-2 px-3 flex items-center gap-2 text-[#C49A6C] text-[11px] font-semibold">
                     <Sparkles size={12} /> Task assistant — Claude
                   </div>
                   <div className="p-3 flex gap-2">
                     <textarea 
                        className="flex-1 bg-white text-[12px] p-2 h-12 rounded border border-[rgba(44,62,80,0.12)] resize-none outline-none focus:border-[#C49A6C]"
                        placeholder="Ask Claude to prioritize your list, draft a task plan, or help with a specific item..."
                     />
                     <button 
                        onClick={runTaskAI}
                        className="bg-[#2C3E50] text-white px-5 text-xs font-semibold rounded-md hover:bg-[#3d5166] transition-colors"
                     >
                       Ask ↗
                     </button>
                   </div>
                   {taskShowOutput && (
                     <div className="p-3 border-t border-[rgba(44,62,80,0.12)] text-[12px] text-[#6b6b6b] leading-relaxed">
                       {taskOutput}
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'marketing' && (
              <motion.div
                key="marketing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <MarketingDashboard />
              </motion.div>
            )}

            {activeTab === 'codex' && (
              <motion.div
                key="codex"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-[13px] font-semibold">Codex Interactive Terminal</h3>
                   
                   <div className="flex items-center gap-2 relative" ref={historyPopoverRef}>
                      <button
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={`p-1 px-2 rounded transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-semibold uppercase tracking-wider ${
                          autoScroll 
                            ? 'text-[#C49A6C] border-[#C49A6C]/30 bg-[#C49A6C]/5 hover:bg-[#C49A6C]/10' 
                            : 'text-slate-500 border-slate-800 bg-transparent hover:text-slate-400 hover:bg-slate-800/40'
                        }`}
                        title={autoScroll ? "Disable automatic scrolling" : "Enable automatic scrolling"}
                      >
                        <ArrowDown size={13} className={autoScroll ? "animate-pulse" : ""} />
                        <span className="text-[10px]">Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        onClick={() => setShowHistoryPopover(!showHistoryPopover)}
                        className={`p-1 px-2 rounded text-slate-500 hover:text-[#C49A6C] hover:bg-[#C49A6C]/10 transition-colors cursor-pointer flex items-center gap-1.5 ${showHistoryPopover ? 'text-[#C49A6C] bg-[#C49A6C]/10' : ''}`}
                        title="Command History"
                      >
                        <History size={13} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">History</span>
                      </button>

                      <AnimatePresence>
                        {showHistoryPopover && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1.5 w-64 bg-[#1a1f2e] border border-slate-800 rounded-md shadow-2xl z-50 overflow-hidden font-mono"
                          >
                            <div className="bg-[#111622] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Terminal History (Last 10)</span>
                              {commandHistory.length > 0 && (
                                <button 
                                  onClick={() => {
                                    setCommandHistory([]);
                                    setHistoryIndex(-1);
                                    setShowHistoryPopover(false);
                                  }}
                                  className="text-[8px] text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/40">
                              {commandHistory.length === 0 ? (
                                <div className="p-4 text-[10px] text-slate-500 italic text-center">
                                  No commands entered yet.
                                </div>
                              ) : (
                                commandHistory.slice(0, 10).map((cmd, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => {
                                      setTerminalInput(cmd);
                                      setHistoryIndex(-1);
                                      setShowHistoryPopover(false);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex justify-between items-center group border-0 bg-transparent"
                                  >
                                    <span className="truncate flex-1 text-left mr-2">{cmd}</span>
                                    <span className="text-[9px] text-[#C49A6C] shrink-0 font-sans font-semibold border border-[#C49A6C]/20 px-1 py-0.5 rounded bg-[#C49A6C]/5">
                                      Use ↵
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ddeeff] text-[#1a6fa8]">Latimore Hub OS</span>
                   </div>
                </div>

                <div className="bg-[#1a1f2e] rounded-md p-3 font-mono text-[11.5px] leading-relaxed h-[240px] overflow-y-auto flex flex-col">
                   <div className="flex-1 space-y-1">
                     {terminalLines.map((line, i) => (
                       <div key={i} className={line.startsWith('>') ? 'text-[#C49A6C]' : 'text-slate-300 whitespace-pre-wrap'}>
                         {line}
                       </div>
                     ))}
                     <div ref={terminalEndRef} />
                   </div>
                   <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-slate-800">
                     <div className="flex items-start gap-2 relative">
                       <span className="text-[#C49A6C] mt-1 font-bold text-xs shrink-0 select-none">$</span>
                       <div className="relative flex-1 flex flex-col">
                         <textarea 
                           ref={textareaRef}
                           value={terminalInput}
                           onChange={(e) => {
                             setTerminalInput(e.target.value);
                             setCursorCharIndex(e.target.selectionStart || 0);
                           }}
                           onSelect={(e) => setCursorCharIndex(e.currentTarget.selectionStart || 0)}
                           onKeyDown={handleTerminalKeyDown}
                           className="bg-transparent border-none outline-none text-[#C49A6C] w-full font-mono text-[11.5px] leading-tight resize-none h-[40px] focus:ring-0 pt-0.5"
                           placeholder="Type command here... (Tab to complete, Enter to Run)"
                           autoFocus
                           rows={2}
                         />

                         {/* Dynamic visual hinting / floating suggestion list */}
                         {tabMatches.length > 0 && (() => {
                           const linesText = terminalInput.slice(0, cursorCharIndex).split('\n');
                           const currentLineText = linesText[linesText.length - 1] || '';
                           const cursorX = currentLineText.length * 7; 
                           const cursorY = (linesText.length - 1) * 16; 
                           
                           return (
                             <div 
                               className="absolute z-50 bg-[#0f1420]/95 border border-[#C49A6C]/30 rounded-md p-1 shadow-2xl flex items-center gap-1.5 font-mono text-[10px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
                               style={{
                                 left: `${Math.min(cursorX, 280)}px`,
                                 top: `${cursorY + 24}px`
                               }}
                             >
                               {tabMatches.map((match, idx) => (
                                 <button
                                   key={match}
                                   type="button"
                                   onClick={() => handleSelectSuggestion(match)}
                                   className={`px-1.5 py-0.5 rounded transition-all cursor-pointer border-0 ${
                                     idx === tabMatchIndex 
                                       ? 'bg-[#C49A6C] text-slate-950 font-bold shadow' 
                                       : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                   }`}
                                 >
                                   {match}
                                 </button>
                               ))}
                               <span className="text-[9px] text-[#C49A6C]/50 italic ml-1 pl-1.5 border-l border-slate-800 select-none shrink-0 font-sans">
                                 Tab to cycle • Esc to close
                                </span>
                             </div>
                           );
                         })()}
                       </div>
                       <button
                         onClick={() => {
                           if (terminalInput.trim()) {
                             processCommand(terminalInput);
                           }
                         }}
                         className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-[#C49A6C] text-[10px] font-bold px-2.5 py-1 rounded border border-slate-700 hover:border-slate-600 transition-all select-none h-[28px] shrink-0 font-sans"
                       >
                         Run
                       </button>
                     </div>
                     <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between mt-1 border-t border-slate-800/40 pt-1 select-none">
                       <span>💡 Shift+Enter adds newline</span>
                       <span>Enter or Run executes</span>
                     </div>
                   </div>
                </div>

                <h3 className="text-[13px] font-semibold pt-1">Codex workflows — run with Claude</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    { title: 'Codebase audit', desc: 'Scan Hub OS for broken routes, missing env vars, and Vercel issues.', icon: SearchCode },
                    { title: 'Termux deploy', desc: 'Ready-to-paste git + Vercel deploy commands for Android Termux.', icon: GitBranch },
                    { title: 'Supabase health check', desc: 'Audit CRM tables, admin routes, and Prisma schema on project.', icon: Database },
                    { title: 'Generate admin page', desc: 'Build a new Hub OS page — leads, CRM, docs. Termux-ready.', icon: Layout },
                  ].map((wf, i) => (
                    <div 
                      key={i}
                      className="border border-[rgba(44,62,80,0.12)] rounded-md p-3 bg-white hover:border-[#C49A6C] cursor-pointer transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#E8D5B7] flex items-center justify-center mb-2 text-[#8B6A45]">
                        <wf.icon size={16} />
                      </div>
                      <div className="text-[12px] font-semibold mb-0.5">{wf.title}</div>
                      <div className="text-[11px] text-[#6b6b6b] leading-tight">{wf.desc}</div>
                      <div className="mt-2 text-[11px] text-[#8B6A45] font-medium flex items-center gap-1">
                        <Play size={10} fill="currentColor" /> Launch ↗
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[rgba(44,62,80,0.12)] my-1" />
                
                <h3 className="text-[13px] font-semibold">AI content — run directly here</h3>
                <div className="border border-[rgba(44,62,80,0.12)] rounded-md overflow-hidden bg-[#fafaf8]">
                   <div className="bg-[#2C3E50] p-2 px-3 flex items-center gap-2 text-[#C49A6C] text-[11px] font-semibold">
                     <Sparkles size={12} /> Codex / Claude integrated prompt
                   </div>
                   <div className="p-3 flex gap-2">
                     <textarea 
                        className="flex-1 bg-white text-[12px] p-2 h-14 rounded border border-[rgba(44,62,80,0.12)] resize-none outline-none focus:border-[#C49A6C]"
                        placeholder="e.g. Generate a Next.js CRM lead table component that pulls from Supabase..."
                     />
                     <button 
                        onClick={runCodexAI}
                        className="bg-[#2C3E50] text-white px-5 text-xs font-semibold rounded-md hover:bg-[#3d5166] transition-colors"
                     >
                       Run ↗
                     </button>
                   </div>
                   {codexShowOutput && (
                     <div className="p-3 border-t border-[rgba(44,62,80,0.12)] text-[11px] font-mono whitespace-pre-wrap text-[#6b6b6b] leading-relaxed">
                       {codexOutput}
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'animator' && (
              <motion.div
                key="animator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <VeoAnimator 
                  onExportToWorkspace={(filename, content) => {
                    createFileSystemItem(filename, 'file', [], content, true);
                  }}
                  workspaceFiles={Object.keys(fileSystem)}
                />
              </motion.div>
            )}

            {activeTab === 'annuities' && (
              <motion.div
                key="annuities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AnnuityPlatform />
              </motion.div>
            )}

            {activeTab === 'genspark' && (
              <motion.div
                key="genspark"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GensparkWorkspace />
              </motion.div>
            )}

            {activeTab === 'workflows' && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WorkflowBuilder />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-6 flex flex-col items-center gap-2 text-[#9a9a9a]">
           <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide">
             <span className="hover:text-[#2C3E50] cursor-pointer">PRIVACY POLICY</span>
             <span className="w-1 h-1 bg-[#C49A6C] rounded-full" />
             <span className="hover:text-[#2C3E50] cursor-pointer">COMPLIANCE HUB</span>
             <span className="w-1 h-1 bg-[#C49A6C] rounded-full" />
             <span className="hover:text-[#2C3E50] cursor-pointer">CRM SETTINGS</span>
           </div>
           <div className="text-[10px] opacity-60">© 2026 Latimore Life & Legacy LLC. All rights reserved.</div>
        </footer>
      </div>
      <Copilot 
        fileSystem={fileSystem}
        onFileWrite={(path, content, type = 'file') => {
          const segments = path.split('/');
          const filename = segments.pop()!;
          const dirPath = segments;
          const err = createFileSystemItem(filename, type as 'file' | 'dir', dirPath, content, true);
          if (err) throw new Error(err);
        }}
        onFileRead={(path) => {
          const segments = path.split('/');
          let curr: any = { children: fileSystem };
          for (const seg of segments) {
            if (curr.children && curr.children[seg]) {
              curr = curr.children[seg];
            } else {
              throw new Error(`File not found: ${path}`);
            }
          }
          if (curr.type !== 'file') throw new Error(`Not a file: ${path}`);
          return curr.content || '';
        }}
      />
    </div>
  );
};

export default App;
