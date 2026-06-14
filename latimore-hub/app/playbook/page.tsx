'use client'

import Link from 'next/link'

export default function PlaybookPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Internal Reference</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latimore OS Master Playbook</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Community Authority · Technical Pipeline · Execution Framework · Schuylkill County Market Strategy 2026
          </p>
          <p className="mt-4 text-[#C49A6C] italic">"Protecting Today. Securing Tomorrow." #TheBeatGoesOn</p>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Part I', subtitle: 'Community Authority Framework', icon: '🏛️', sections: ['Strategic Vision', 'Press-Style Credibility', 'PAHS Blueprint', 'Multi-Platform Distribution', 'Physical Dominance'] },
            { title: 'Part II', subtitle: 'Technical Infrastructure', icon: '⚙️', sections: ['Latimore OS Data Core', 'Multi-Channel Entry Points', 'Zapier Automation', 'Pipeline Management'] },
            { title: 'Part III', subtitle: 'Execution & Compliance', icon: '📋', sections: ['Pre-Launch Checklist', 'KPI Matrix', 'Brand Compliance Review', 'DM Scripts', 'School District Blueprint'] },
          ].map((part) => (
            <div key={part.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-3xl mb-3">{part.icon}</div>
              <div className="text-xs font-bold text-[#C49A6C] uppercase tracking-widest mb-1">{part.title}</div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{part.subtitle}</h3>
              <ul className="space-y-1">
                {part.sections.map(s => (
                  <li key={s} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49A6C] flex-shrink-0"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section 1: Strategic Vision */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#2C3E50] text-white text-sm font-bold px-3 py-1 rounded">1</span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">Strategic Vision: From Service Provider to Community Pillar</h2>
          </div>
          <blockquote className="border-l-4 border-[#C49A6C] pl-6 py-2 mb-6 bg-amber-50 rounded-r-lg">
            <p className="text-[#2C3E50] italic font-medium">"We are not purchasing advertising. We are owning a conversation that the community was already having."</p>
          </blockquote>
          <p className="text-gray-700 mb-4">In close-knit, post-industrial markets like Schuylkill County, conventional advertising fails because it arrives without context, without roots, and without trust. The Community-Driven Authority Framework deploys 'community alignment signals' — strategic markers that establish the brand as a recognized partner in local life before the first financial conversation occurs.</p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { title: 'Press-Style Credibility', desc: 'Editorial-style assets that signal institutional weight and professional legitimacy without cold solicitation.' },
              { title: 'Local Tradition Embedding', desc: 'Aligning with the PAHS Crimson Tide Football program and the broader Schuylkill County athletic calendar.' },
              { title: 'Lead Capture Gateways', desc: 'Converting every physical and digital impression into a measurable data point in the Latimore OS pipeline.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="font-bold text-[#2C3E50] mb-2 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: PAHS Blueprint */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#2C3E50] text-white text-sm font-bold px-3 py-1 rounded">3</span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">Community Alignment: The PAHS Blueprint</h2>
          </div>
          <p className="text-gray-700 mb-6">The ALL-STAR Sponsorship of PAHS Crimson Tide Football is not a logo placement — it is a legacy play. Jackson Latimore competed against Pottsville growing up. In 2005, after transferring from North Schuylkill, Latimore won Most Valuable Player. That personal history converts the sponsorship from a vendor transaction into a community proof point.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Legitimacy Signaling', desc: 'Transforms the sponsorship into a landmark community event. Positions Latimore Life & Legacy as newsworthy.' },
              { label: 'Community Alignment', desc: 'Aligns the brand with Friday night traditions of PAHS football, establishing shared identity with local families.' },
              { label: 'Lead Capture Integration', desc: 'Every game-day program, QR code, and press graphic is hard-wired to card.latimorelifelegacy.com/pahs.' },
            ].map(item => (
              <div key={item.label} className="border-l-4 border-[#C49A6C] pl-4">
                <h4 className="font-bold text-[#2C3E50] text-sm mb-1">{item.label}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Multi-Platform Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#2C3E50] text-white text-sm font-bold px-3 py-1 rounded">4</span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">Multi-Platform Distribution Strategy</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Platform</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Strategy</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Key Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { platform: 'Facebook & LinkedIn', strategy: 'Long-form authority drops with newspaper-style graphics', action: 'Pin post immediately. Caption ends with binary CTA: scan QR or DM "PROTECT."' },
                  { platform: 'Instagram', strategy: 'Visual-first awareness with Link-in-Bio Protocol', action: 'Update bio link to card.latimorelifelegacy.com/pahs before each campaign.' },
                  { platform: 'Reels & TikTok', strategy: '15–30 second cinematic clips', action: 'Bold text overlays. QR end card visible minimum 3 seconds.' },
                  { platform: 'Physical Print', strategy: '8.5x11 glossy + 5x7 handout cards', action: '300 DPI minimum. QR minimum 1.5" x 1.5". All route to pahs URL.' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.platform}</td>
                    <td className="py-3 px-4 text-gray-700">{row.strategy}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-[#2C3E50] text-white rounded-lg p-4">
            <h4 className="font-bold text-[#C49A6C] mb-2">⚡ The 60-Second Self-Comment Rule</h4>
            <p className="text-sm">Post a comment within 60 seconds of publishing on every platform. The comment must offer two clear paths: scan the QR code or DM "PROTECT." This immediate engagement signal forces algorithmic velocity — higher reach at zero additional cost.</p>
          </div>
        </div>

        {/* Section 4: KPI Matrix */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#2C3E50] text-white text-sm font-bold px-3 py-1 rounded">11</span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">Performance Benchmarks & KPI Matrix</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm italic">Baseline: 274 total views and 169 interactions (Nov 2025 – Apr 2026). The PAHS framework is designed to scale these figures within the first 90 days of full deployment.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Metric</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Baseline</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Monthly Target</th>
                  <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Optimization Trigger</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Post Reach / Views', baseline: '274 (6 mo.)', target: '1,000+', trigger: 'If low: increase post frequency and paid boost' },
                  { metric: 'QR Code Scans', baseline: '169 (6 mo.)', target: '50+', trigger: 'If low vs. reach: optimize physical placement' },
                  { metric: 'Landing Page Visits', baseline: 'N/A', target: '100+', trigger: 'If low vs. scans: improve link-in-bio and UTM routing' },
                  { metric: 'Leads Captured', baseline: '0', target: '10+', trigger: 'If low vs. visits: optimize landing page copy and form' },
                  { metric: 'Assessments Booked', baseline: '0', target: '5+', trigger: 'If low vs. leads: sharpen DM script and CTA' },
                  { metric: 'Referral Rate', baseline: '0%', target: '20–30%', trigger: 'If low: add referral ask to post-close sequence' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.metric}</td>
                    <td className="py-3 px-4 text-gray-500">{row.baseline}</td>
                    <td className="py-3 px-4 font-bold text-green-700">{row.target}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{row.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DM Scripts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#C49A6C] text-white text-sm font-bold px-3 py-1 rounded">APP A</span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">DM Outreach Scripts</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                title: 'Script 1 — Primary Diagnostic (Social Engagers)',
                trigger: 'Use within the response timeline for all likes, comments, and shares on PAHS-related posts.',
                script: `INITIAL OUTREACH\n"Appreciate the support on the PAHS post! Quick question: Have you reviewed your life insurance or retirement strategy in the last 12-18 months?"\n\nIF YES: "That's great. Most people I talk to haven't looked at it in years. Would it be worth a quick 15-minute review to make sure you're still in the best position? I can send a link."\n\nIF NO: "That's actually really common — a lot can change in a year. I'd love to offer a free 15-minute assessment to see where you stand. Want me to send a link?"`
              },
              {
                title: 'Script 2 — Keyword DM Trigger ("PROTECT")',
                trigger: 'Automated response when prospect DMs the keyword "PROTECT" via any platform.',
                script: `AUTOMATED FIRST RESPONSE\n"Thanks for reaching out! I'm Jackson Latimore with Latimore Life & Legacy — I help families in Schuylkill County protect what matters most. Here's your free assessment link: [BOOKING LINK]. Takes about 2 minutes to schedule. #TheBeatGoesOn"\n\nFOLLOW-UP (if no booking within 24 hours):\n"Hey [Name] — just wanted to make sure the link came through okay. Have you reviewed your coverage in the last year or so? Happy to answer any questions before you book."`
              },
              {
                title: 'Script 3 — Post-Assessment Referral Ask',
                trigger: 'Send within 7 days of a successfully closed assessment or policy.',
                script: `REFERRAL REQUEST\n"[Name], I genuinely appreciate the trust you placed in me. If you know anyone — a family member, coworker, or neighbor — who could benefit from a quick conversation about their financial protection, I'd be grateful for the introduction. A simple text or DM is all it takes. I'll take great care of them."\n\n"Protecting Today. Securing Tomorrow. #TheBeatGoesOn"`
              },
            ].map((script) => (
              <div key={script.title} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#2C3E50] px-6 py-3">
                  <h4 className="font-bold text-white text-sm">{script.title}</h4>
                  <p className="text-gray-300 text-xs mt-1">Trigger: {script.trigger}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{script.script}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#C49A6C] font-semibold transition-colors">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}