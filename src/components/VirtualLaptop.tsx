
import React, { useState } from 'react';
import { 
  FilePlus, 
  FolderPlus, 
  ChevronLeft, 
  Folder, 
  FileText, 
  Code2, 
  Database,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualLaptopProps {
  fileSystem: any;
  explorerPath: string[];
  selectedFileName?: string;
  setExplorerPath: React.Dispatch<React.SetStateAction<string[]>>;
  createFileSystemItem: (name: string, type: 'file' | 'dir', path: string[], content?: string) => string | null;
  onFileSelect: (name: string, item: any) => void;
}

export const VirtualLaptop: React.FC<VirtualLaptopProps> = ({ 
  fileSystem, 
  explorerPath, 
  selectedFileName,
  setExplorerPath, 
  createFileSystemItem,
  onFileSelect
}) => {
  const [isCreating, setIsCreating] = useState<'file' | 'dir' | null>(null);
  const [newItemName, setNewItemName] = useState('');

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

  const currentDir = getDirContents(explorerPath) || {};

  const handleCreate = () => {
    if (!newItemName.trim()) return;
    const err = createFileSystemItem(newItemName, isCreating === 'file' ? 'file' : 'dir', explorerPath);
    if (err) {
      alert(err);
    } else {
      setNewItemName('');
      setIsCreating(null);
    }
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
      default:
        return <FileText className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[rgba(44,62,80,0.12)] shadow-sm overflow-hidden flex flex-col h-[500px]">
      {/* OS-like Header */}
      <div className="bg-[#2C3E50] p-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fdd]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fff3d4]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4edda]" />
          </div>
          <span className="text-white/40 text-[10px] font-mono ml-2 uppercase tracking-widest">Latimore OS / Explorer</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCreating('file')}
            className="text-white/70 hover:text-[#C49A6C] transition-colors p-1"
            title="New File"
          >
            <FilePlus size={14} />
          </button>
          <button 
            onClick={() => setIsCreating('dir')}
            className="text-white/70 hover:text-[#C49A6C] transition-colors p-1"
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* Path Bar */}
      <div className="bg-[#f9f8f6] border-b border-[rgba(44,62,80,0.12)] p-2 px-4 flex items-center gap-2">
        <button 
          onClick={() => setExplorerPath(prev => prev.slice(0, -1))}
          disabled={explorerPath.length === 0}
          className="text-[#2C3E50] disabled:opacity-30 p-1 hover:bg-black/5 rounded transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6b6b6b] overflow-hidden">
          <span 
            className="shrink-0 text-[#2C3E50] font-bold cursor-pointer hover:text-[#C49A6C] transition-colors"
            onClick={() => setExplorerPath([])}
          >
            ~
          </span>
          {explorerPath.map((seg, i) => (
            <React.Fragment key={i}>
              <span className="text-[#9a9a9a] select-none">/</span>
              <span 
                className="truncate cursor-pointer hover:text-[#C49A6C] transition-colors"
                onClick={() => setExplorerPath(prev => prev.slice(0, i + 1))}
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Creation Dialog */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-[#f9f8f6] p-3 rounded-lg border border-[#C49A6C]/30 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#2C3E50] uppercase tracking-wider">
                  New {isCreating === 'file' ? 'File' : 'Folder'}
                </span>
                <button onClick={() => setIsCreating(null)} className="text-[#6b6b6b] hover:text-[#1a1a1a]">
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                <input 
                  autoFocus
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder={`Enter ${isCreating === 'file' ? 'filename.ext' : 'folder name'}...`}
                  className="flex-1 bg-white border border-[rgba(44,62,80,0.12)] rounded px-3 py-1.5 text-xs outline-none focus:border-[#C49A6C]"
                />
                <button 
                  onClick={handleCreate}
                  className="bg-[#2C3E50] text-white px-3 py-1.5 rounded text-[10px] font-bold hover:bg-[#3d5166] transition-colors"
                >
                  CREATE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(currentDir).map(([name, item]: [string, any]) => {
            const isSelected = name === selectedFileName;
            return (
              <motion.div
                layout
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(196, 154, 108, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.type === 'dir') {
                    setExplorerPath(prev => [...prev, name]);
                  } else {
                    onFileSelect(name, item);
                  }
                }}
                className={`group cursor-pointer flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-[#C49A6C]/10 border-[#C49A6C]/30 shadow-sm' 
                    : 'border-transparent hover:border-[rgba(44,62,80,0.12)]'
                }`}
              >
                <div className={`relative p-2 rounded-lg transition-colors ${
                  isSelected ? 'bg-white shadow-sm' : 'group-hover:bg-white/50'
                }`}>
                  {getFileIcon(name, item.type)}
                  {item.type === 'dir' && (
                    <div className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 bg-[#C49A6C] rounded-full border border-white" />
                  )}
                </div>
                <span className={`text-[11px] font-medium text-center truncate w-full px-1 transition-colors ${
                  isSelected ? 'text-[#2C3E50]' : 'text-[#6b6b6b] group-hover:text-[#2C3E50]'
                }`}>
                  {name}
                </span>
                {isSelected && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-[#C49A6C] rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
          
          {Object.keys(currentDir).length === 0 && !isCreating && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-[#9a9a9a]">
              <Search size={32} className="opacity-20 mb-2" />
              <p className="text-[11px] font-medium italic">This directory is empty</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer / Status */}
      <div className="bg-[#f9f8f6] border-t border-[rgba(44,62,80,0.12)] p-2 px-4 flex items-center justify-between">
        <div className="text-[9px] text-[#9a9a9a] uppercase font-bold tracking-widest">
          {Object.keys(currentDir).length} Items
        </div>
        <div className="text-[9px] text-[#9a9a9a] font-mono">
          Latimore OS v1.2.0
        </div>
      </div>
    </div>
  );
};
