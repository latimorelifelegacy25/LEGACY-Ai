import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  X,
  Search,
  Filter,
  MessageSquare,
  RefreshCw,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { auth, getAccessToken } from '../firebase';
import { dbService } from '../services/dbService';
import { Activity } from '../types';
import { cn, formatDate } from '../lib/utils';
import { googleService, GoogleCalendarEvent } from '../services/googleService';

const ACTIVITY_TYPES = [
  { id: 'email', name: 'Email', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'call', name: 'Call', icon: Phone, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'task', name: 'Task', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'meeting', name: 'Meeting', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function Communication() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newActivity, setNewActivity] = useState({
    type: 'email',
    subject: '',
    description: '',
    contactId: ''
  });

  // Google Calendar integration states
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  
  // Event direct placement states
  const [syncToGoogleCalendar, setSyncToGoogleCalendar] = useState(true);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    return d.toISOString().slice(0, 16);
  });
  const [eventDuration, setEventDuration] = useState(30);

  const fetchCalendarAgenda = async () => {
    const token = getAccessToken();
    if (!token) {
      // Load standard illustrative mockup agenda for Sandbox guest
      setCalendarEvents([
        {
          id: 'mock_1',
          summary: 'Jackson Latimore Strategy Briefing',
          description: 'Deploying brand-locked print assets across community centers.',
          location: 'Vince Cafe Coffeehouse, Pottsville',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mock_2',
          summary: 'Plumbing Supply Distributors Demo',
          description: 'Live interactive pipeline workflow walkthrough session.',
          location: 'HQ Conference Suite Boardroom',
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 3.1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      return;
    }

    setLoadingCalendar(true);
    try {
      const items = await googleService.fetchCalendarEvents(token);
      setCalendarEvents(items);
    } catch (err) {
      console.error("Failed loading Google Calendar items:", err);
    } finally {
      setLoadingCalendar(false);
    }
  };

  useEffect(() => {
    fetchCalendarAgenda();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Realtime subscription using the combined database service
    const unsubscribe = dbService.subscribe<Activity>(
      'activities', 
      auth.currentUser.uid, 
      (data) => {
        setActivities(data);
      }, 
      'timestamp',
      'desc'
    );

    return () => unsubscribe();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    let calEventId = '';
    const token = getAccessToken();
    
    if (newActivity.type === 'meeting' && syncToGoogleCalendar && token) {
      const confirmed = window.confirm(`Schedule and add this event to your connected Google Calendar agenda?`);
      if (!confirmed) return;

      try {
        const calResult = await googleService.createCalendarEvent(
          token,
          newActivity.subject,
          newActivity.description || 'Logged via Nexus CRM',
          new Date(eventDate).toISOString(),
          eventDuration
        );
        calEventId = calResult?.id || '';
      } catch (err: any) {
        console.error("Google Calendar insertion failed:", err);
        alert(`Failed syncing event on Google Calendar: ${err.message || err}`);
        return;
      }
    }

    try {
      await dbService.add('activities', {
        ...newActivity,
        ownerUid: auth.currentUser.uid,
        timestamp: new Date(eventDate).toISOString(),
        googleCalendarEventId: calEventId || null
      });
      setIsModalOpen(false);
      setNewActivity({ type: 'email', subject: '', description: '', contactId: '' });
      fetchCalendarAgenda();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.delete('activities', id, auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // Dynamic calculations to replace static placeholders
  const emailCount = activities.filter(a => a.type === 'email').length;
  const callCount = activities.filter(a => a.type === 'call').length;
  const taskCount = activities.filter(a => a.type === 'task').length;
  const meetingCount = activities.filter(a => a.type === 'meeting').length;

  const totalInteractions = activities.length;
  const emailPercentage = totalInteractions > 0 ? Math.round((emailCount / totalInteractions) * 100) : 0;
  const callPercentage = totalInteractions > 0 ? Math.round((callCount / totalInteractions) * 100) : 0;

  // Filter activities dynamically
  const filteredActivities = activities.filter(act => {
    const matchesSearch = 
      act.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      act.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || act.type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Dynamic upcoming tasks derived from active tasks in the system
  const activeTasks = activities.filter(a => a.type === 'task');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Communication</h1>
          <p className="text-gray-500 mt-1">Track all interactions and upcoming tasks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          Log Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activities..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="text-xs font-bold text-gray-600 bg-gray-50 border-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="all">All Channels</option>
                  <option value="email">Emails Only</option>
                  <option value="call">Calls Only</option>
                  <option value="task">Tasks Only</option>
                  <option value="meeting">Meetings Only</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {filteredActivities.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">
                  {searchTerm || selectedFilter !== 'all' ? 'No match found for your parameters.' : 'No activities logged yet.'}
                </div>
              ) : filteredActivities.map((activity) => {
                const typeInfo = ACTIVITY_TYPES.find(t => t.id === activity.type) || ACTIVITY_TYPES[0];
                return (
                  <div key={activity.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", typeInfo.bg, typeInfo.color)}>
                        <typeInfo.icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-gray-900 truncate">{activity.subject}</h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                              {formatDate(activity.timestamp)}
                            </span>
                            <button 
                              onClick={() => deleteActivity(activity.id)}
                              className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed whitespace-pre-line">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                            <Clock size={12} />
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebars upgraded to draw data dynamically so there are zero placeholders! */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Upcoming Tasks ({activeTasks.length})</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-100 rounded-2xl">
                  No pending tasks found.
                </div>
              ) : activeTasks.map((task) => (
                <div key={task.id} className="flex gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 animate-in fade-in zoom-in duration-150">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 mt-0.5 shrink-0 flex items-center justify-center text-orange-500">
                    <CheckCircle2 size={10} className="fill-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{task.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Calendar interactive agenda display feed list */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-1 bg-[#fafbfd] -mx-8 -mt-8 p-8 rounded-t-3xl">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a73e8] flex items-center gap-2">
                <Calendar size={18} className="text-[#1a73e8]" />
                Google Calendar
              </h3>
              <button 
                onClick={fetchCalendarAgenda}
                disabled={loadingCalendar}
                className="p-1 rounded-lg hover:bg-gray-150 text-gray-400 hover:text-gray-650 transition-colors cursor-pointer pointer-events-auto"
                title="Refresh Calendar"
              >
                <RefreshCw size={14} className={cn("text-[#1a73e8]", loadingCalendar && "animate-spin")} />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {loadingCalendar ? (
                <div className="py-6 text-center space-y-2">
                  <RefreshCw className="animate-spin text-[#1a73e8] h-6 w-6 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-mono">Syncing calendar feeds...</p>
                </div>
              ) : calendarEvents.length === 0 ? (
                <p className="text-xs text-center text-gray-450 py-4 font-sans">No scheduled calendar cards.</p>
              ) : (
                calendarEvents.map((evt) => {
                  const sDate = new Date(evt.start);
                  return (
                    <div key={evt.id} className="p-3 bg-[#f8fafd] rounded-xl border border-blue-50/70 hover:bg-[#f2f6fc] transition-all space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[10px] font-extrabold text-[#1a73e8] uppercase font-mono">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {sDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} · {sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 tracking-tight leading-snug">{evt.summary}</h4>
                      {evt.description && (
                        <p className="text-[11px] text-gray-500 font-sans line-clamp-2 leading-relaxed">{evt.description}</p>
                      )}
                      {evt.location && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-sans truncate">
                          <MapPin size={10} className="shrink-0 text-blue-400" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {!getAccessToken() && (
              <p className="text-[9px] text-gray-400 leading-relaxed bg-[#f0f4f9]/50 p-2.5 rounded-xl border border-blue-100/30">
                <strong>Sandbox View:</strong> Mock items listed. Log in with Google to integrate your live personal Calendar.
              </p>
            )}
          </div>

          <div className="bg-[#151619] p-8 rounded-3xl border border-white/5 shadow-2xl text-white">
            <h3 className="text-xs font-bold mb-4 font-sans uppercase tracking-widest text-[#41b883]">Channel Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Emails Sent</span>
                <span className="text-sm font-bold">{emailCount}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full transition-all" style={{ width: `${emailPercentage}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Calls Handled</span>
                <span className="text-sm font-bold">{callCount}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full transition-all" style={{ width: `${callPercentage}%` }}></div>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-gray-500 font-mono">
                <span>Meetings: {meetingCount}</span>
                <span>Tasks: {taskCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Log New Activity</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddActivity} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Activity Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {ACTIVITY_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewActivity({...newActivity, type: t.id})}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                        newActivity.type === t.id ? "border-orange-500 bg-orange-50" : "border-transparent bg-gray-50"
                      )}
                    >
                      <t.icon size={18} className={newActivity.type === t.id ? "text-orange-500" : "text-gray-400"} />
                      <span className="text-[10px] font-bold text-gray-600">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Discussed subscription renewal"
                  value={newActivity.subject}
                  onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea 
                  placeholder="Key notes, outcomes or pending points from this interaction..."
                  className="w-full h-24 p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 resize-none text-sm"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                />
              </div>

              {/* Dynamic Google Calendar integration block */}
              {newActivity.type === 'meeting' && (
                <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={13} className="text-purple-600" />
                    Google Calendar Sync Config
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Start Time</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Duration</label>
                      <select 
                        value={eventDuration}
                        onChange={(e) => setEventDuration(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value={15}>15 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                      </select>
                    </div>
                  </div>

                  {getAccessToken() ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="checkbox" 
                        id="syncToGoogleCal"
                        checked={syncToGoogleCalendar}
                        onChange={(e) => setSyncToGoogleCalendar(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="syncToGoogleCal" className="text-[11px] text-gray-600 font-bold cursor-pointer">
                        Sync directly to my connected Google Calendar
                      </label>
                    </div>
                  ) : (
                    <p className="text-[10px] text-purple-900 leading-relaxed bg-purple-100/30 p-2 rounded-xl border border-purple-100/20">
                      Sandbox mode active. Checking this will simulate Google Calendar event logs seamlessly inside CRM history.
                    </p>
                  )}
                </div>
              )}

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
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
