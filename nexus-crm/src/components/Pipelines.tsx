import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  DollarSign, 
  Calendar,
  ChevronRight,
  X 
} from 'lucide-react';
import { auth } from '../firebase';
import { dbService } from '../services/dbService';
import { Deal } from '../types';
import { cn, formatCurrency } from '../lib/utils';

const STAGES = [
  { id: 'new', name: 'New Lead', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-indigo-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-purple-500' },
  { id: 'won', name: 'Closed Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Closed Lost', color: 'bg-red-500' }
];

export default function Pipelines() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: 0,
    stage: 'new'
  });
  const [isDraggingId, setIsDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setIsDraggingId(id);
  };

  const handleDragEnd = () => {
    setIsDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      await updateDealStage(dealId, stageId);
    }
    setDragOverStage(null);
    setIsDraggingId(null);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = dbService.subscribe<Deal>(
      'deals', 
      auth.currentUser.uid, 
      (data) => {
        setDeals(data);
      },
      'createdAt',
      'desc'
    );

    return () => unsubscribe();
  }, []);

  const createFollowUpTaskForDeal = async (deal: Deal) => {
    if (!auth.currentUser) return;
    try {
      await dbService.add('activities', {
        type: 'task',
        subject: `Follow up: ${deal.title}`,
        description: `Deal stage changed to Proposal. Prepare and follow up on the proposal documentation.`,
        contactId: deal.contactId || '',
        ownerUid: auth.currentUser.uid,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating follow-up task:", error);
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const dealData = {
        ...newDeal,
        ownerUid: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };
      
      const insertedId = await dbService.add('deals', dealData);
      
      if (newDeal.stage === 'proposal') {
        await createFollowUpTaskForDeal({
          id: insertedId,
          ...dealData
        } as Deal);
      }

      setIsModalOpen(false);
      setNewDeal({ title: '', value: 0, stage: 'new' });
    } catch (error) {
      console.error("Error adding deal:", error);
    }
  };

  const updateDealStage = async (id: string, newStage: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.update('deals', id, { stage: newStage }, auth.currentUser.uid);

      if (newStage === 'proposal') {
        const deal = deals.find(d => d.id === id);
        if (deal) {
          await createFollowUpTaskForDeal(deal);
        }
      }
    } catch (error) {
      console.error("Error updating deal:", error);
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.delete('deals', id, auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-gray-500 mt-1">Track your deals and revenue opportunities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          New Deal
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)}></div>
                  <h3 className="font-bold text-gray-900">{stage.name}</h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500">{formatCurrency(totalValue)}</p>
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, stage.id)}
                onDragLeave={(e) => handleDragLeave(e, stage.id)}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={cn(
                  "space-y-4 min-h-[500px] p-3 rounded-3xl border transition-all duration-200",
                  dragOverStage === stage.id
                    ? "bg-orange-50/70 border-orange-300 border-dashed scale-[1.01] shadow-inner"
                    : isDraggingId
                      ? "bg-gray-100/40 border-gray-200 border-dashed"
                      : "bg-gray-50/50 border-gray-200 border-dashed"
                )}
              >
                {stageDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing",
                      isDraggingId === deal.id ? "opacity-40 border-dashed border-gray-300 shadow-none scale-95" : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{deal.title}</h4>
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-4 font-mono">
                      <DollarSign size={14} className="text-gray-400" />
                      {formatCurrency(deal.value)}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                        <Calendar size={12} />
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        {STAGES.map((s, idx) => {
                          const currentIdx = STAGES.findIndex(x => x.id === stage.id);
                          if (idx === currentIdx + 1) {
                            return (
                              <button 
                                key={s.id}
                                onClick={() => updateDealStage(deal.id, s.id)}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                title={`Move to ${s.name}`}
                              >
                                <ChevronRight size={16} />
                              </button>
                            );
                          }
                          return null;
                        })}
                        <button 
                          onClick={() => deleteDeal(deal.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-xs text-gray-400 font-medium">
                    No deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Deal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddDeal} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Deal Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Enterprise Software License"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm h-11 text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Deal Value ($)</label>
                <input 
                  required
                  type="number" 
                  value={newDeal.value || ''}
                  onChange={(e) => setNewDeal({...newDeal, value: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm h-11 text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Initial Stage</label>
                <select 
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({...newDeal, stage: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm h-11 text-gray-700"
                >
                  {STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
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
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 text-sm animate-pulse"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
