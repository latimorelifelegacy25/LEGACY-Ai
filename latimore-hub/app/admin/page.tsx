'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  county?: string
  createdAt: string
}

interface Inquiry {
  id: string
  interestType: string
  status: string
  createdAt: string
  contact: Contact
}

const OS_MODULES = [
  { href: '/admin/content-tool', icon: '✍️', title: 'AI Content Generator', desc: 'Generate brand-consistent weekly social posts', color: 'bg-purple-600', badge: 'NEW' },
  { href: '/carriers', icon: '🏛️', title: 'Carrier Buildout', desc: 'North American, F&G, Ethos, Foresters, Corebridge', color: 'bg-blue-700', badge: 'NEW' },
  { href: '/products', icon: '📦', title: 'Products Suite', desc: 'IUL, FIA, Term, Living Benefits, Final Expense', color: 'bg-green-700', badge: 'NEW' },
  { href: '/personas', icon: '👥', title: 'Client Personas', desc: '5 market segments with scripts & product mapping', color: 'bg-pink-600', badge: 'NEW' },
  { href: '/business', icon: '🏢', title: 'Business Services', desc: 'Key Person, Buy-Sell, Executive Bonus, School Districts', color: 'bg-amber-700', badge: 'NEW' },
  { href: '/admin/pipeline', icon: '📊', title: 'Pipeline Management', desc: 'Drag-and-drop Kanban board for lead management', color: 'bg-[#2C3E50]', badge: null },
  { href: '/admin/analytics', icon: '📈', title: 'Analytics Dashboard', desc: 'Lead attribution and conversion tracking', color: 'bg-green-600', badge: null },
  { href: '/admin/social', icon: '📱', title: 'Social Workflow', desc: 'AI-powered social media content system', color: 'bg-blue-600', badge: null },
  { href: '/playbook', icon: '📖', title: 'OS Master Playbook', desc: 'Community authority framework & DM scripts', color: 'bg-indigo-600', badge: null },
  { href: '/campaign', icon: '🏈', title: 'PAHS Campaign Module', desc: 'Ethos integration, game day scripts & direct mail', color: 'bg-orange-600', badge: null },
  { href: '/calendar', icon: '📅', title: '12-Month Calendar', desc: 'Annual strategic calendar with weekly action plans', color: 'bg-teal-600', badge: null },
  { href: '/scripts', icon: '🎯', title: 'Client Presentation Scripts', desc: 'GFI 10-step system — Appointment 1 guide', color: 'bg-red-600', badge: null },
]

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries?status=New_Inquiry')
      const data = await response.json()
      setInquiries(data.items || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C3E50] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2C3E50] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LatimoreHub Admin</h1>
            <p className="text-gray-300 mt-1">Latimore Life & Legacy LLC — OS Command Center</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p className="text-[#C49A6C] font-semibold">"Protecting Today. Securing Tomorrow."</p>
            <p>#TheBeatGoesOn | PA DOI #1268820</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Inquiries', value: inquiries.length, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
            { label: 'Velocity Leads', value: inquiries.filter(i => i.interestType === 'Velocity').length, color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
            { label: 'Depth Leads', value: inquiries.filter(i => i.interestType === 'Depth').length, color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
            { label: 'Group Leads', value: inquiries.filter(i => i.interestType === 'Group').length, color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
          ].map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl border ${stat.color} p-5`}>
              <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* OS Modules Grid */}
        <div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Latimore OS Modules</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {OS_MODULES.map(mod => (
              <Link
                key={mod.href}
                href={mod.href}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group relative overflow-hidden"
              >
                {mod.badge && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{mod.badge}</span>
                )}
                <div className={`w-10 h-10 ${mod.color} rounded-lg flex items-center justify-center text-xl mb-3`}>
                  {mod.icon}
                </div>
                <h3 className="font-bold text-[#2C3E50] text-sm group-hover:text-[#C49A6C] transition-colors">{mod.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#2C3E50] text-white rounded-xl p-6">
            <h3 className="font-bold text-[#C49A6C] mb-2">🚀 Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/consult" className="block text-sm text-gray-300 hover:text-white transition-colors">→ View Consult Form</Link>
              <Link href="/book" className="block text-sm text-gray-300 hover:text-white transition-colors">→ Open Booking Page</Link>
              <Link href="/admin/content-tool" className="block text-sm text-gray-300 hover:text-white transition-colors">→ Generate This Week's Posts</Link>
              <Link href="/admin/pipeline" className="block text-sm text-gray-300 hover:text-white transition-colors">→ Review Pipeline</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] mb-2">📋 Pre-Launch Checklist</h3>
            <div className="space-y-2">
              {[
                { item: 'QR codes tested on iPhone & Android', done: false },
                { item: 'Supabase test lead submitted', done: false },
                { item: 'Zapier email fires within 60 sec', done: false },
                { item: 'GA4 tracking confirmed active', done: false },
                { item: 'Ethos co-branded link configured', done: false },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 ${check.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></span>
                  {check.item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] mb-2">📊 Year 1 Progress</h3>
            <div className="space-y-3">
              {[
                { label: 'Revenue Target', current: '$0', goal: '$98,000', pct: 0 },
                { label: 'Leads', current: inquiries.length.toString(), goal: '187', pct: Math.min(100, (inquiries.length / 187) * 100) },
                { label: 'Clients Closed', current: '0', goal: '44', pct: 0 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.label}</span>
                    <span>{item.current} / {item.goal}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#C49A6C] h-2 rounded-full transition-all" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2C3E50]">Recent Inquiries</h2>
            <Link href="/admin/pipeline" className="text-sm text-[#C49A6C] hover:underline font-semibold">View Pipeline →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Contact', 'Interest', 'County', 'Received', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.slice(0, 10).map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2C3E50]">{inquiry.contact.firstName} {inquiry.contact.lastName}</div>
                      <div className="text-gray-500 text-xs">{inquiry.contact.email}</div>
                      {inquiry.contact.phone && <div className="text-gray-400 text-xs">{inquiry.contact.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        inquiry.interestType === 'Velocity' ? 'bg-blue-100 text-blue-800' :
                        inquiry.interestType === 'Depth' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>{inquiry.interestType}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{inquiry.contact.county || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {inquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {inquiries.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No inquiries yet</h3>
              <p className="text-gray-500 text-sm">New leads will appear here when they submit the consultation form.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}