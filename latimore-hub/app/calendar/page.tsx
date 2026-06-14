'use client'

import { useState } from 'react'
import Link from 'next/link'

const MONTHS = [
  { month: 'April 2026', revenue: '$2,000', leads: 5, theme: 'Full Circle Launch', quarter: 'Q1', weeks: [
    { week: 'Week 1', items: ['Launch Full Circle campaign on all social platforms', 'Announce PAHS sponsorship via social media and press release', 'Enroll in Chamber of Commerce; attend orientation meeting', 'Activate content calendar; schedule first week of posts'] },
    { week: 'Week 2', items: ['Set up CRM system and lead tracking workflows', 'Create and distribute first email newsletter', 'Attend first Chamber of Commerce meeting', 'Order PAHS sponsorship banners and signage'] },
    { week: 'Week 3', items: ['Launch Facebook and Instagram ad campaign ($50 budget)', 'Record and post brand introduction video', 'Connect with 5 local businesses for cross-promotion', 'Set up automated email sequences in CRM'] },
    { week: 'Week 4', items: ['Host first community introduction event (target 10+ attendees)', 'Publish first blog article on website', 'Review Month 1 KPIs and adjust strategy', 'Send personalized outreach to 10 warm leads'] },
  ]},
  { month: 'May 2026', revenue: '$3,000', leads: 7, theme: 'AED Awareness & Community Roots', quarter: 'Q1', weeks: [
    { week: 'Week 1', items: ['Launch AED Awareness Month social media series', 'Plan community AED workshop for June', 'Visit PAHS spring practice; connect with coaching staff', 'Create Mother\'s Day themed protection content'] },
    { week: 'Week 2', items: ['Attend Chamber meeting; join a committee', 'Produce PAHS spring practice highlight content', 'Increase social ad spend to $75/month', 'Follow up with all April leads; book discovery calls'] },
    { week: 'Week 3', items: ['Memorial Day community content and outreach', 'Send second monthly newsletter', 'Begin designing referral program structure', 'P&C study: chapters 10–12; full-length practice exam'] },
    { week: 'Week 4', items: ['Review Month 2 KPIs; adjust content strategy', 'Finalize AED workshop logistics for June', 'P&C exam: schedule exam date for mid-June', 'Prepare summer content series assets (10+ pieces drafted)'] },
  ]},
  { month: 'June 2026', revenue: '$5,000', leads: 10, theme: 'P&C License + Referral Launch', quarter: 'Q1', weeks: [
    { week: 'Week 1', items: ['Launch Summer Protection Series content campaign', 'Activate PAHS summer camp sponsorship presence', 'Final P&C exam preparation — intensive study week', 'Host AED awareness community workshop (target 15+ attendees)'] },
    { week: 'Week 2', items: ['TAKE P&C LICENSING EXAM — CRITICAL MILESTONE', 'Launch referral program — announce to clients and network', 'Attend PAHS summer camp events; create athlete content', 'Send monthly newsletter with summer protection tips'] },
    { week: 'Week 3', items: ['Celebrate P&C license achievement on social media', 'Begin carrier appointment process for P&C products', 'Summer community festival participation (target 50+ visitors)', 'Cross-promote with 3 local summer businesses'] },
    { week: 'Week 4', items: ['Q1 COMPREHENSIVE REVIEW — quarterly performance assessment', 'Plan Q2 game day activation logistics', 'Ramp social ad spend to $100/month for summer', 'Update website with P&C product offerings'] },
  ]},
  { month: 'August 2026', revenue: '$8,000', leads: 15, theme: 'Season Kickoff — Game Day Launch', quarter: 'Q2', weeks: [
    { week: 'Week 1', items: ['PAHS SEASON OPENER — First game day booth activation (target 50+ visitors, 15+ leads)', 'Launch Full Circle reveal campaign peak content', 'Back to School family protection social campaign', 'Media outreach push — pitch Jackson\'s story to local news'] },
    { week: 'Week 2', items: ['Game Day 2 — booth activation; incorporate Week 1 learnings', 'Launch Back to School Family Protection email campaign', 'Post game day recap content and highlight reels', 'Host back-to-school family event with free resources'] },
    { week: 'Week 3', items: ['Game Day 3 — refine booth experience based on feedback', 'Increase ad spend to $150/month targeting game day audiences', 'Create weekly game day content cadence template', 'Follow up with ALL game day leads within 48 hours'] },
    { week: 'Week 4', items: ['Game Day 4 — booth activation (target 75+ visitors)', 'Send September game day preview newsletter', 'Review August KPIs; mid-season strategy adjustment', 'P&C cross-sell: present auto/home options to 5 clients'] },
  ]},
  { month: 'September 2026', revenue: '$10,000', leads: 18, theme: 'Peak Season — LIAM + Homecoming', quarter: 'Q2', weeks: [
    { week: 'Week 1', items: ['Game Day 5 — weekly booth activation (target 80+ visitors, 20+ leads)', 'Life Insurance Awareness Month campaign launch', 'Labor Day community content and outreach', 'Chamber committee project — active contribution'] },
    { week: 'Week 2', items: ['Game Day 6 — booth activation; homecoming prep', 'Client conversion push — follow up with all pipeline leads', 'Friday Night Lights content series — peak engagement week', 'Explore 2 new community partnership opportunities'] },
    { week: 'Week 3', items: ['HOMECOMING GAME DAY — Enhanced booth activation (target 100+ visitors, 30+ leads)', 'Homecoming-themed social content blitz', 'Send homecoming special newsletter', 'Expand community partnerships — sign 2 new agreements'] },
    { week: 'Week 4', items: ['Game Day 8 — booth activation', 'Q2 QUARTERLY REVIEW — peak season assessment', 'Quarterly referral blitz campaign launch', 'Plan October financial literacy workshop series'] },
  ]},
  { month: 'November 2026', revenue: '$12,000', leads: 20, theme: '1-Year Anniversary + Gratitude', quarter: 'Q3', weeks: [
    { week: 'Week 1', items: ['Game Day 12 — SENIOR NIGHT activation (target 100+ visitors)', 'Open enrollment peak marketing push', 'November newsletter — anniversary and gratitude theme', 'Begin 1-year anniversary campaign content creation'] },
    { week: 'Week 2', items: ['Regular season finale — Game Day 13', 'Thanksgiving Gratitude Campaign launch', 'Thanksgiving community food drive participation', 'Year-end planning kick-off — review Year 1 goals'] },
    { week: 'Week 3', items: ['Thanksgiving Gratitude Campaign peak — send personal client thank-you cards', 'Attend Chamber annual dinner / event', 'Playoff game sponsorship support (if PAHS qualifies)', 'Plan Year-End Legacy campaign for December'] },
    { week: 'Week 4', items: ['1-YEAR ANNIVERSARY CELEBRATION (Nov 28) — event, media, community', 'Anniversary social media content blitz (target 1,000+ engagements)', 'Q3 QUARTERLY REVIEW — complete quarterly performance assessment', 'Send anniversary thank-you to all referral partners'] },
  ]},
  { month: 'February 2027', revenue: '$10,000', leads: 22, theme: 'Heart Month — #TheBeatGoesOn', quarter: 'Q4', weeks: [
    { week: 'Week 1', items: ['LAUNCH Heart Month Campaign — Jackson\'s survivor story (target 1,500+ impressions)', '#TheBeatGoesOn social media amplification begins', 'AED Advocacy Push — partner with local health organizations', 'Pitch Heart Month story to regional and national media'] },
    { week: 'Week 2', items: ['Cardiac arrest awareness workshop (target 30+ attendees; AED demonstration)', 'Valentine\'s Day — "Protect the ones you love" campaign', 'February newsletter — Heart Month special edition', 'Tax Season Campaign continuation — mid-season push'] },
    { week: 'Week 3', items: ['AED advocacy community event — CPR training day (target 25+ participants)', 'Heart Month video testimonial — Jackson\'s full story (target 1,000+ views)', 'Expand sponsorship portfolio — present to 3 new organizations', 'Community partnership renewal discussions begin'] },
    { week: 'Week 4', items: ['Heart Month campaign wrap-up and impact report published', 'Review February KPIs — Heart Month performance assessment', 'PAHS Year 2 sponsorship renewal negotiation begins', 'Plan March Growth Sprint strategy'] },
  ]},
]

const ANNUAL_TARGETS = [
  { month: 'April 2026', revenue: '$2,000', leads: 5 },
  { month: 'May 2026', revenue: '$3,000', leads: 7 },
  { month: 'June 2026', revenue: '$5,000', leads: 10 },
  { month: 'July 2026', revenue: '$6,000', leads: 12 },
  { month: 'August 2026', revenue: '$8,000', leads: 15 },
  { month: 'September 2026', revenue: '$10,000', leads: 18 },
  { month: 'October 2026', revenue: '$12,000', leads: 20 },
  { month: 'November 2026', revenue: '$12,000', leads: 20 },
  { month: 'December 2026', revenue: '$10,000', leads: 15 },
  { month: 'January 2027', revenue: '$8,000', leads: 18 },
  { month: 'February 2027', revenue: '$10,000', leads: 22 },
  { month: 'March 2027', revenue: '$12,000', leads: 25 },
]

export default function CalendarPage() {
  const [activeMonth, setActiveMonth] = useState(0)
  const current = MONTHS[activeMonth]

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Strategic Operations</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">12-Month Annual Strategic Calendar</h1>
          <p className="text-xl text-gray-300">April 2026 — March 2027 | Master Operating Roadmap</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Revenue Target', value: '$98,000' },
              { label: 'Total Lead Target', value: '187 leads' },
              { label: 'Clients Closed', value: '44 clients' },
              { label: 'Campaign Budget', value: '$14,600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#C49A6C]">{stat.value}</div>
                <div className="text-xs text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Annual Revenue Ramp */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Annual Revenue & Lead Ramp</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Month</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Revenue Target</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Lead Target</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {ANNUAL_TARGETS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.month}</td>
                    <td className="py-3 px-4 text-green-700 font-bold">{row.revenue}</td>
                    <td className="py-3 px-4 text-blue-700 font-bold">{row.leads} leads</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#C49A6C] h-2 rounded-full" style={{ width: `${(row.leads / 25) * 100}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#2C3E50] text-white">
                  <td className="py-3 px-4 font-bold">YEAR 1 TOTAL</td>
                  <td className="py-3 px-4 font-bold text-[#C49A6C]">$98,000</td>
                  <td className="py-3 px-4 font-bold text-[#C49A6C]">187 leads</td>
                  <td className="py-3 px-4 text-gray-300 text-xs">44 clients closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Monthly Action Plans</h2>
          {/* Month Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {MONTHS.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveMonth(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeMonth === i ? 'bg-[#2C3E50] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {m.month}
              </button>
            ))}
          </div>

          {/* Active Month */}
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-[#2C3E50]">{current.month}</h3>
              <span className="bg-[#C49A6C] text-white text-xs px-3 py-1 rounded-full">{current.quarter}</span>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">{current.revenue}</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">{current.leads} leads</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full italic">{current.theme}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {current.weeks.map((week) => (
                <div key={week.week} className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-[#2C3E50] mb-3 text-sm">{week.week}</h4>
                  <ul className="space-y-2">
                    {week.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5"></span>
                        <span className={item.includes('CRITICAL') || item.includes('MILESTONE') || item.includes('OPENER') || item.includes('HOMECOMING') || item.includes('ANNIVERSARY') || item.includes('LAUNCH') ? 'font-semibold text-[#2C3E50]' : ''}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Planner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Annual Budget Planner — $14,600 Total</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { category: 'PAHS Sponsorship Package', cost: '$2,500', pct: '17.1%', priority: 'Critical' },
              { category: 'Contingency / Opportunity Fund', cost: '$2,400', pct: '16.4%', priority: 'Medium' },
              { category: 'Social Media Advertising', cost: '$1,400', pct: '9.6%', priority: 'High' },
              { category: 'Print Materials', cost: '$1,400', pct: '9.6%', priority: 'High' },
              { category: 'Photography / Videography', cost: '$1,400', pct: '9.6%', priority: 'Medium' },
              { category: 'Software & Automation', cost: '$1,200', pct: '8.2%', priority: 'High' },
              { category: 'Website Hosting & Tools', cost: '$900', pct: '6.2%', priority: 'High' },
              { category: 'Event Supplies & Booth Materials', cost: '$1,300', pct: '8.9%', priority: 'High' },
              { category: 'Community Sponsorships (Additional)', cost: '$800', pct: '5.5%', priority: 'Medium' },
              { category: 'Chamber of Commerce Dues', cost: '$500', pct: '3.4%', priority: 'High' },
              { category: 'Professional Development & Licensing', cost: '$500', pct: '3.4%', priority: 'Critical' },
              { category: 'Email Marketing Platform', cost: '$300', pct: '2.1%', priority: 'Medium' },
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="text-sm font-semibold text-[#2C3E50]">{item.category}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.priority === 'Critical' ? 'bg-red-100 text-red-700' : item.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{item.priority}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2C3E50]">{item.cost}</p>
                  <p className="text-xs text-gray-500">{item.pct}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#C49A6C] font-semibold transition-colors">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}