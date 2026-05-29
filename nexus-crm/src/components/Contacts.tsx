import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Check,
  Copy,
  RefreshCw,
  Briefcase,
  Layers,
  FileText,
  History,
  Send,
  UserCheck,
  Mail,
  AlertCircle
} from 'lucide-react';
import { auth, getAccessToken } from '../firebase';
import { dbService } from '../services/dbService';
import { Contact } from '../types';
import { cn, formatDate } from '../lib/utils';
import { generatePersonalizedEmail } from '../services/gemini';
import { googleService, GoogleContactImport, GmailMessagePreview } from '../services/googleService';

const OBJECTIVES = [
  { id: 'lead_nurturing', name: 'Lead Nurturing', description: 'Build relationships with warm prospects.' },
  { id: 'sales_followup', name: 'Sales Follow-up', description: 'Re-engage leads after previous conversations.' },
  { id: 'product_launch', name: 'Product Launch Announcement', description: 'Announce new services or feature releases.' },
  { id: 're_engagement', name: 'Cold Re-engagement', description: 'Bring cold or inactive leads back into the funnel.' },
  { id: 'custom', name: 'Custom Objective', description: 'Write a specific instruction for the AI.' }
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New contact form state
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    notes: '',
    status: 'lead'
  });

  // AI Email Outreach Drafting Form State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [pastInteractions, setPastInteractions] = useState<string[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [campaignObjective, setCampaignObjective] = useState('lead_nurturing');
  const [customObjective, setCustomObjective] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // AI Email draft output
  const [draftedSubject, setDraftedSubject] = useState('');
  const [draftedBody, setDraftedBody] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [draftErrorMessage, setDraftErrorMessage] = useState<string | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Google Integration states
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncingContacts, setSyncingContacts] = useState(false);
  const [googleContactsToImport, setGoogleContactsToImport] = useState<any[]>([]);
  const [checkedContacts, setCheckedContacts] = useState<Set<number>>(new Set());
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Live Gmail message tracking
  const [liveGmailMessages, setLiveGmailMessages] = useState<GmailMessagePreview[]>([]);
  const [loadingGmailMessages, setLoadingGmailMessages] = useState(false);
  const [sendingGmail, setSendingGmail] = useState(false);
  const [gmailMessageTab, setGmailMessageTab] = useState<'nexus' | 'live'>('nexus');

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = dbService.subscribe<Contact>(
      'contacts', 
      auth.currentUser.uid, 
      (data) => {
        setContacts(data);
        setLoading(false);
      },
      'createdAt',
      'desc'
    );

    return () => unsubscribe();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await dbService.add('contacts', {
        ...newContact,
        ownerUid: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        industry: '',
        notes: '',
        status: 'lead'
      });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      await dbService.delete('contacts', id, auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Google Contacts Synchronization implementation
  const handleOpenGoogleSync = async () => {
    const token = getAccessToken();
    setIsSyncModalOpen(true);
    setCheckedContacts(new Set());
    setImportStatus(null);
    setGoogleContactsToImport([]);

    if (!token) {
      // Prompt user or offer demo simulation
      return;
    }

    setSyncingContacts(true);
    try {
      const gContacts = await googleService.fetchGoogleContacts(token);
      setGoogleContactsToImport(gContacts);
      // Check all by default
      const defaultChecked = new Set<number>();
      gContacts.forEach((_, idx) => defaultChecked.add(idx));
      setCheckedContacts(defaultChecked);
    } catch (err: any) {
      console.error("Failed importing google contacts:", err);
      setImportStatus(`Failed connecting to Google Contacts: ${err.message || err}.`);
    } finally {
      setSyncingContacts(false);
    }
  };

  const toggleCheckedContact = (idx: number) => {
    const newChecked = new Set(checkedContacts);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedContacts(newChecked);
  };

  const handleImportVerifiedContacts = async () => {
    if (!auth.currentUser) return;
    setSyncingContacts(true);
    setImportStatus("Importing checked contacts into Nexus database...");
    
    let count = 0;
    try {
      for (const idx of Array.from(checkedContacts)) {
        const contact = googleContactsToImport[idx];
        if (!contact) continue;

        await dbService.add('contacts', {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone || '',
          company: contact.company || '',
          jobTitle: contact.jobTitle || '',
          industry: contact.industry || 'Tech',
          notes: contact.notes || 'Imported from Google Contacts',
          status: 'lead',
          ownerUid: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        count++;
      }
      setImportStatus(`Successfully synced and imported ${count} contacts!`);
      setTimeout(() => {
        setIsSyncModalOpen(false);
        setImportStatus(null);
      }, 1500);
    } catch (err: any) {
      console.error("Failed saving imported contacts:", err);
      setImportStatus(`Error importing database: ${err.message}`);
    } finally {
      setSyncingContacts(false);
    }
  };

  // Pre-load demo contacts for Sandbox users
  const handleSimulateSandboxConnections = () => {
    const sandboxLeads = [
      { firstName: "Elena", lastName: "Rostova", email: "elena.rostova@nexus-corp.com", phone: "+1 (555) 321-9876", company: "Nexus Corp", jobTitle: "VP of Product", notes: "Sandbox simulation contact" },
      { firstName: "Marcus", lastName: "Vance", email: "mvance@innovate-solutions.org", phone: "+1 (555) 765-4321", company: "Innovate Solutions", jobTitle: "Lead DevOps Specialist", notes: "Sandbox simulation contact" },
      { firstName: "Sarah", lastName: "Chen", email: "schen@quantum-ventures.io", phone: "+1 (555) 901-2345", company: "Quantum Ventures", jobTitle: "Managing General Partner", notes: "Sandbox simulation contact" },
    ];
    setGoogleContactsToImport(sandboxLeads);
    const defaultChecked = new Set<number>();
    sandboxLeads.forEach((_, idx) => defaultChecked.add(idx));
    setCheckedContacts(defaultChecked);
  };

  // Fetch live Gmail conversations helper
  const fetchLiveGmailMessages = async (email: string) => {
    const token = getAccessToken();
    if (!token) {
      setLiveGmailMessages([]);
      return;
    }
    setLoadingGmailMessages(true);
    try {
      const msgs = await googleService.fetchConversations(token, email);
      setLiveGmailMessages(msgs);
    } catch (err) {
      console.error("Failed fetching live gmail threads:", err);
      setLiveGmailMessages([]);
    } finally {
      setLoadingGmailMessages(false);
    }
  };

  // Simulate Gmail threads for guest sandbox users
  const handleSimulateLiveEmails = () => {
    if (!selectedContact) return;
    setLiveGmailMessages([
      {
        id: 'sim_email_1',
        from: selectedContact.email,
        subject: `Re: Strategy alignment update for ${selectedContact.company || 'Nexus CRM'}`,
        date: 'Today, 2:15 PM',
        snippet: `Hello, thanks for the dispatch. Visited the Pottsville community center and confirmed the 11x17 brand flyers are printed and look pristine with zero fear-based items. Let's touch base soon!`
      },
      {
        id: 'sim_email_2',
        from: auth.currentUser?.email || 'agency-admin@latimore.com',
        subject: `Strategy alignment update for ${selectedContact.company || 'Nexus CRM'}`,
        date: 'Yesterday, 10:45 AM',
        snippet: `Hi ${selectedContact.firstName}, sharing the ready-to-print marketing layouts and campaign outline files for physical distribution across the Coal region. Regards.`
      }
    ]);
  };

  // Send email direct via connected Gmail account
  const handleSendGmailDirectly = async () => {
    if (!selectedContact) return;
    const token = getAccessToken();
    if (!token) {
      alert("No active Google session found. Please sign out and sign in using Google to send live external emails.");
      return;
    }

    // Require explicit confirmation for mutating/external operations
    const confirmed = window.confirm(
      `Are you sure you want to send this real email to ${selectedContact.firstName} ${selectedContact.lastName} (<${selectedContact.email}>) directly from your connected Google workspace account?`
    );
    if (!confirmed) return;

    setSendingGmail(true);
    try {
      await googleService.sendEmail(token, selectedContact.email, draftedSubject, draftedBody);
      
      // Log interaction in db
      if (auth.currentUser) {
        await dbService.add('activities', {
          type: 'email',
          subject: `[Gmail Live Sent] ${draftedSubject}`,
          description: draftedBody,
          contactId: selectedContact.id,
          ownerUid: auth.currentUser.uid,
          timestamp: new Date().toISOString()
        });
      }
      
      setSuccessMessage("Email successfully delivered using live Gmail API & logged to database!");
      fetchLiveGmailMessages(selectedContact.email);
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setSuccessMessage(null);
      }, 1800);
    } catch (err: any) {
      console.error("Failed sending email:", err);
      alert(`Email dispatch failed via Google: ${err.message || err}`);
    } finally {
      setSendingGmail(false);
    }
  };

  // Fetch activities in order to supply Gemini with past interaction history context
  const fetchPastInteractions = async (contactId: string) => {
    if (!auth.currentUser) return;
    setLoadingInteractions(true);
    try {
      const fetched = await dbService.getAll('activities', auth.currentUser.uid);
      const filtered = fetched.filter((act: any) => act.contactId === contactId);
      
      // Sort in memory by timestamp descending
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const interactionLogs = filtered.slice(0, 5).map((act: any) => 
        `[Logged ${act.type.toUpperCase()}] Subject: ${act.subject}${act.description ? ` - Details: ${act.description}` : ''}`
      );
      setPastInteractions(interactionLogs);
    } catch (e) {
      console.error("Error loading interactions:", e);
      setPastInteractions([]);
    } finally {
      setLoadingInteractions(false);
    }
  };

  const handleOpenEmailDraftModal = (contact: Contact) => {
    setSelectedContact(contact);
    setCampaignObjective('lead_nurturing');
    setCustomObjective('');
    setAdditionalNotes('');
    setDraftedSubject('');
    setDraftedBody('');
    setSuccessMessage(null);
    setDraftErrorMessage(null);
    setEmailCopied(false);
    setIsEmailModalOpen(true);
    setGmailMessageTab('nexus');
    fetchPastInteractions(contact.id);
    fetchLiveGmailMessages(contact.email);
  };

  const handleGenerateAISubjectAndBody = async () => {
    if (!selectedContact) return;
    setDraftErrorMessage(null);
    setIsDrafting(true);
    try {
      const objectiveText = campaignObjective === 'custom' 
        ? customObjective 
        : OBJECTIVES.find(o => o.id === campaignObjective)?.name || 'Outreach';

      const draftResult = await generatePersonalizedEmail({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        company: selectedContact.company,
        jobTitle: selectedContact.jobTitle,
        industry: selectedContact.industry,
        pastInteractions: pastInteractions,
        objective: objectiveText,
        additionalNotes: additionalNotes
      });

      if (draftResult) {
        // Simple extraction of Subject and Body
        const subjectMatch = draftResult.match(/^Subject:\s*(.*)/mi);
        let extractedSubject = `Personalized Outreach - ${selectedContact.company || ''}`;
        let extractedBody = draftResult;

        if (subjectMatch) {
          extractedSubject = subjectMatch[1].trim();
          // Remove the Subject line from output to make body clean
          extractedBody = draftResult.replace(/^Subject:\s*(.*)/mi, '').trim();
        }

        setDraftedSubject(extractedSubject);
        setDraftedBody(extractedBody);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gemini email drafting failed.';
      setDraftErrorMessage(message);
      console.error("Error drafting personalized email:", err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopyEmail = () => {
    const fullContent = `Subject: ${draftedSubject}\n\n${draftedBody}`;
    navigator.clipboard.writeText(fullContent);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleLogEmailActivity = async () => {
    if (!auth.currentUser || !selectedContact) return;

    try {
      await dbService.add('activities', {
        type: 'email',
        subject: `[AI Outreach] ${draftedSubject}`,
        description: draftedBody,
        contactId: selectedContact.id,
        ownerUid: auth.currentUser.uid,
        timestamp: new Date().toISOString()
      });
      setSuccessMessage("Email activity successfully logged in past interactions!");
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (e) {
      console.error("Error logging email activity:", e);
    }
  };

  // Filter contacts by search term and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.jobTitle && contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.industry && contact.industry.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contacts</h1>
          <p className="text-gray-500 mt-1">Manage your relationships with automated AI workflows.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleOpenGoogleSync}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#f0f4f9] hover:bg-[#e1e9f5] text-[#1a73e8] font-bold rounded-2xl transition-all shadow-sm border border-[#1a73e8]/5 pointer-events-auto cursor-pointer"
          >
            <RefreshCw size={18} className={cn("text-[#1a73e8]", syncingContacts && "animate-spin")} />
            Sync Google Contacts
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 pointer-events-auto cursor-pointer"
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, industry..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm font-semibold text-gray-600 bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company & Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Outreach Workflows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading contacts...</td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No contacts found matching the filters.</td>
                </tr>
              ) : filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                        {contact.firstName ? contact.firstName[0] : ''}{contact.lastName ? contact.lastName[0] : ''}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 font-semibold">{contact.jobTitle || 'No Title Listed'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 size={12} className="text-gray-400" />
                        {contact.company || '—'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {contact.industry ? (
                        <span className="px-2.5 py-0.5 bg-gray-100 ring-1 ring-gray-200 text-gray-700 text-xs rounded-full font-medium">
                          {contact.industry}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not specified</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      contact.status === 'lead' && "bg-blue-50 text-blue-600",
                      contact.status === 'prospect' && "bg-orange-50 text-orange-600",
                      contact.status === 'customer' && "bg-green-50 text-green-600",
                      contact.status === 'lost' && "bg-red-50 text-red-600",
                    )}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEmailDraftModal(contact)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all"
                        title="AI Personalized Email Outbox"
                      >
                        <Sparkles size={14} />
                        AI Draft
                      </button>
                      <button 
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Contact"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredContacts.length} of {contacts.length} contacts</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Outreach / Email Drafting Modal */}
      {isEmailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh]">
            
            {/* Left Column: Input Variables & Context */}
            <div className="w-full lg:w-[42%] bg-gray-50/70 p-6 border-r border-gray-100 overflow-y-auto max-h-[45vh] lg:max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-orange-600">
                  <Sparkles size={22} />
                  <span className="font-bold text-lg tracking-tight">AI outreach Assistant</span>
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(false)} 
                  className="p-1 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Patient Profile Quick Cards */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Profile</span>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{selectedContact.jobTitle || 'No Title listed'} at <strong className="text-gray-900">{selectedContact.company || 'unnamed Inc.'}</strong></p>
                  </div>
                  {selectedContact.industry && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600">Industry: <strong className="text-gray-900">{selectedContact.industry}</strong></span>
                    </div>
                  )}
                  {selectedContact.notes && (
                    <p className="text-xs text-gray-500 italic bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                      Note: {selectedContact.notes}
                    </p>
                  )}
                </div>                {/* Past interactions context & Live Gmail Threads tabs */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex border-b border-gray-100 bg-[#fbfbfb]">
                    <button
                      type="button"
                      onClick={() => setGmailMessageTab('nexus')}
                      className={cn(
                        "flex-1 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer",
                        gmailMessageTab === 'nexus' 
                          ? "border-orange-500 text-orange-600 bg-orange-50/5 font-bold" 
                          : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                      )}
                    >
                      CRM Logs ({pastInteractions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setGmailMessageTab('live')}
                      className={cn(
                        "flex-1 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5",
                        gmailMessageTab === 'live' 
                          ? "border-[#1a73e8] text-[#1a73e8] bg-blue-50/5 font-bold" 
                          : "border-transparent text-gray-400 hover:text-[#1a73e8]/70 hover:bg-gray-50/50"
                      )}
                    >
                      <Mail size={12} />
                      Live Gmail Thread
                    </button>
                  </div>

                  <div className="p-4">
                    {gmailMessageTab === 'nexus' ? (
                      <div className="space-y-3">
                        {loadingInteractions ? (
                          <p className="text-xs text-gray-400 animate-pulse">Scanning logged files...</p>
                        ) : pastInteractions.length === 0 ? (
                          <div className="text-xs text-gray-400 py-3 border-dotted border border-gray-200 rounded-xl text-center">
                            No logged interactions. AI will draft a cold outreach.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {pastInteractions.map((act, index) => (
                              <div key={index} className="text-[11px] leading-relaxed text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-100">
                                {act}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Live Gmail Tab
                      <div className="space-y-3">
                        {!getAccessToken() ? (
                          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] leading-relaxed text-[#1a73e8]">
                            <p className="font-bold flex items-center gap-1 mb-1">
                              <AlertCircle size={12} />
                              OAuth Required
                            </p>
                            <p>To view live Gmail correspondence, please log in with your Google Account. Guest sandbox simulates threads below.</p>
                            <button
                              type="button"
                              onClick={handleSimulateLiveEmails}
                              className="mt-2.5 px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg text-[10px] transition-all uppercase cursor-pointer"
                            >
                              Simulate Live Thread
                            </button>
                          </div>
                        ) : loadingGmailMessages ? (
                          <div className="text-center py-4">
                            <RefreshCw size={20} className="animate-spin text-[#1a73e8] mx-auto" />
                            <p className="text-xs text-gray-400 mt-2 font-mono">Querying from: {selectedContact.email}...</p>
                          </div>
                        ) : liveGmailMessages.length === 0 ? (
                          <div className="text-[11px] text-center text-gray-400 py-4">
                            No live Gmail messages matched <code className="bg-gray-100 p-0.5 rounded">{selectedContact.email}</code> yet.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {liveGmailMessages.map((msg) => (
                              <div key={msg.id} className="p-2 bg-[#f8fafd] hover:bg-[#f0f4f9] rounded-lg border border-blue-100/30 text-[11px] transition-all">
                                <div className="flex items-center justify-between text-gray-500 font-bold mb-1">
                                  <span className="truncate text-[#1a73e8]">{msg.from.split("<")[0] || msg.from}</span>
                                  <span className="text-[9px] shrink-0 font-mono">{msg.date.split(",")[0] || msg.date}</span>
                                </div>
                                <h5 className="font-bold text-gray-850 mb-0.5 truncate">{msg.subject}</h5>
                                <p className="text-gray-500 font-sans line-clamp-2 leading-tight">{msg.snippet}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Strategy Objective select */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <Layers size={12} className="text-gray-400" />
                      Campaign Objective
                    </label>
                    <select
                      value={campaignObjective}
                      onChange={(e) => setCampaignObjective(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                    >
                      {OBJECTIVES.map(obj => (
                        <option key={obj.id} value={obj.id}>{obj.name}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 italic font-sans mt-1 leading-snug">
                      {OBJECTIVES.find(o => o.id === campaignObjective)?.description}
                    </p>
                  </div>

                  {campaignObjective === 'custom' && (
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Prompt Goal</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Schedule a 15 min zoom check-in"
                        value={customObjective}
                        onChange={(e) => setCustomObjective(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <FileText size={12} className="text-gray-400" />
                      Additional Context/Offer
                    </label>
                    <textarea
                      placeholder="e.g. Offer 20% discount on software, offer a free trial, reference their recent LinkedIn post..."
                      className="w-full h-24 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 text-xs shadow-sm resize-none"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGenerateAISubjectAndBody}
                    disabled={isDrafting || (campaignObjective === 'custom' && !customObjective.trim())}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isDrafting ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Sparkles size={18} />
                    )}
                    {isDrafting ? 'Gemini Drafting...' : 'Draft Personalised Email'}
                  </button>

                  {draftErrorMessage && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-[11px] leading-relaxed">
                      {draftErrorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: AI Output Editor & Log Controls */}
            <div className="w-full lg:w-[58%] p-6 flex flex-col justify-between overflow-y-auto max-h-[45vh] lg:max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-sans tracking-tight">Personalized Outreach Draft</h3>
                  <p className="text-xs text-gray-500">Edit the AI drafted email and subject line below.</p>
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(false)} 
                  className="hidden lg:flex p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <X size={22} />
                </button>
              </div>

              {successMessage ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-green-50/50 rounded-2xl border border-green-200 p-8 my-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Check size={26} />
                  </div>
                  <h4 className="text-base font-bold text-green-900">{successMessage}</h4>
                  <p className="text-xs text-green-600/80">Synchronized and saved to Interaction logs!</p>
                </div>
              ) : !draftedSubject && !draftedBody ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center py-12 text-gray-500">
                  <div className="p-4 bg-orange-50 rounded-full text-orange-500">
                    <Sparkles size={36} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Ready to Personalize</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                      Select campaign options on the left and click "Draft Personalised Email" to begin writing with Gemini AI.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-4 my-2">
                  {/* Subject input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject Line</label>
                    <input
                      type="text"
                      value={draftedSubject}
                      onChange={(e) => setDraftedSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/10 font-medium text-sm text-gray-900"
                    />
                  </div>

                  {/* Body Textarea with dynamic highlights hint */}
                  <div className="space-y-1 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Content</label>
                      <span className="text-[10px] text-orange-500 flex items-center gap-1 font-bold">
                        <UserCheck size={12} />
                        Placeholders formatted
                      </span>
                    </div>
                    <textarea
                      value={draftedBody}
                      onChange={(e) => setDraftedBody(e.target.value)}
                      className="w-full h-80 lg:h-96 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/10 text-sm text-gray-700 leading-relaxed font-mono resize-none"
                    />
                  </div>

                  {/* Formatting Dynamic Tip */}
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex gap-2">
                    <Sparkles size={16} className="text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      <strong>AI Placeholder Tip:</strong> Placeholders like <code>[Contact Name]</code>, <code>[Company Name]</code>, or <code>[Your Name]</code> are ready. Modify them directly in the text box above to make any final polishes.
                    </p>
                  </div>
                </div>
              )}              {/* Log actions footer */}
              {draftedSubject && draftedBody && !successMessage && (
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 min-w-[120px] py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy Draft
                      </>
                    )}
                  </button>

                  {getAccessToken() ? (
                    <button
                      onClick={handleSendGmailDirectly}
                      disabled={sendingGmail}
                      className="flex-1 min-w-[150px] py-3 px-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md text-xs cursor-pointer"
                    >
                      {sendingGmail ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Mail size={16} />
                      )}
                      {sendingGmail ? "Sending Gmail..." : "Send via Gmail API"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const confirmSend = window.confirm("You are currently logged in with sandbox guest credentials. Would you like to emulate direct mail dispatch and log this email activity instantly?");
                        if (confirmSend) {
                          handleLogEmailActivity();
                        }
                      }}
                      className="flex-1 min-w-[150px] py-3 px-4 bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 text-[#1a73e8] font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
                    >
                      <Mail size={16} />
                      Send (Mock Mode)
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogEmailActivity}
                    className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-orange-500/20 text-xs cursor-pointer"
                  >
                    <Send size={16} />
                    Log activity Only
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Google Contacts Sync Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#f8fafd]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Google Contacts Importer</h3>
                  <p className="text-xs text-gray-500">Select and synchronise your contacts seamlessly</p>
                </div>
              </div>
              <button onClick={() => setIsSyncModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {importStatus && (
                <div className={cn(
                  "p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-2.5",
                  importStatus.includes("Error") || importStatus.includes("Failed")
                    ? "bg-red-50 border-red-100 text-red-600"
                    : "bg-green-50 border-green-100 text-green-600"
                )}>
                  {importStatus.includes("Error") || importStatus.includes("Failed") ? (
                    <AlertCircle size={18} className="shrink-0" />
                  ) : (
                    <Check size={18} className="shrink-0 text-green-600" />
                  )}
                  <p className="font-semibold">{importStatus}</p>
                </div>
              )}

              {!getAccessToken() && googleContactsToImport.length === 0 ? (
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-3">
                  <p className="font-bold flex items-center gap-1.5 text-blue-900">
                    <AlertCircle size={14} className="text-blue-500" />
                    Google Account Required
                  </p>
                  <p className="leading-relaxed">
                    You are currently using guest mode or Sandbox Admin login. To fetch live connections from your actual Google People API list, please sign out and sign in using Google.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={handleSimulateSandboxConnections}
                      className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl text-xs transition-all uppercase cursor-pointer"
                    >
                      Load Simulation Contacts
                    </button>
                  </div>
                </div>
              ) : syncingContacts ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="animate-spin text-blue-500 h-10 w-10 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">Connecting Google People API endpoint...</p>
                  <p className="text-xs text-gray-400 font-mono">Requesting: /v1/people/me/connections</p>
                </div>
              ) : googleContactsToImport.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <UserCheck size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-bold text-gray-700">No Contacts Found</p>
                  <p className="text-xs mt-1">Make sure you have authorized access or add dummy connections on Google Contacts.</p>
                </div>
              ) : (
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2">
                    <span>{googleContactsToImport.length} Connections Retrieved</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const allSelected = checkedContacts.size === googleContactsToImport.length;
                        if (allSelected) {
                          setCheckedContacts(new Set());
                        } else {
                          const next = new Set<number>();
                          googleContactsToImport.forEach((_, i) => next.add(i));
                          setCheckedContacts(next);
                        }
                      }}
                      className="text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      {checkedContacts.size === googleContactsToImport.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {googleContactsToImport.map((c, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleCheckedContact(idx)}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer pointer-events-auto",
                          checkedContacts.has(idx) 
                            ? "bg-blue-50/50 border-blue-200" 
                            : "bg-white border-gray-100 hover:bg-gray-50/70"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={checkedContacts.has(idx)}
                            onChange={() => {}} // toggled by parent div row
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{c.firstName} {c.lastName}</h4>
                            <p className="text-xs text-gray-500">{c.email || 'No email'} · {c.company || 'No Company'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-md px-1.5 py-0.5 uppercase tracking-wide">
                          {c.jobTitle || 'Lead'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {googleContactsToImport.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-[#f8fafd] flex justify-between items-center whitespace-nowrap">
                <span className="text-xs font-semibold text-gray-500">
                  {checkedContacts.size} of {googleContactsToImport.length} selected
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 text-xs transition-all uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleImportVerifiedContacts}
                    disabled={syncingContacts || checkedContacts.size === 0}
                    className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl text-xs transition-all shadow-md uppercase disabled:opacity-50 cursor-pointer"
                  >
                    Import Selected ({checkedContacts.size})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Add New Contact</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input 
                    required
                    type="text" 
                    value={newContact.firstName}
                    onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input 
                    required
                    type="text" 
                    value={newContact.lastName}
                    onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
                  <input 
                    type="text" 
                    value={newContact.company}
                    onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Director of Marketing"
                    value={newContact.jobTitle}
                    onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Industry</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tech, SaaS, Finance"
                    value={newContact.industry}
                    onChange={(e) => setNewContact({...newContact, industry: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Life-Cycle Status</label>
                  <select 
                    value={newContact.status}
                    onChange={(e) => setNewContact({...newContact, status: e.target.value as any})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 text-sm"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Profile Notes</label>
                <textarea 
                  placeholder="Key background information about this lead..."
                  className="w-full h-16 p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 resize-none text-xs text-gray-700"
                  value={newContact.notes}
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
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
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
