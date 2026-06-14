'use client'

import { useState } from 'react'

const AUDIENCE_SEGMENTS = [
  'Young families in Schuylkill County',
  'Pre-retirees approaching retirement',
  'Manufacturing/Logistics employees',
  'Sandwich Generation (Working-Age Adults)',
  'Emerging Hispanic Community (Young Families)',
  'Small Business Owners',
  'School District & Municipal Employees',
]

const PLATFORMS = ['Facebook', 'LinkedIn', 'Instagram', 'Facebook & LinkedIn']

const POST_TYPES = [
  { day: 'Monday', type: 'Education Post', icon: '📚', desc: 'Teach a concept, explain a product feature, or share a financial tip' },
  { day: 'Tuesday', type: 'FAQ Post', icon: '❓', desc: 'Answer a common question your audience asks' },
  { day: 'Wednesday', type: 'Authority Post', icon: '🏛️', desc: 'Founder story, local authority positioning, community proof point' },
  { day: 'Thursday', type: 'Objection Breaker', icon: '🛡️', desc: 'Address a common objection or misconception' },
  { day: 'Friday', type: 'Soft CTA Post', icon: '📞', desc: 'Gentle call-to-action pointing to booking or quote' },
]

const COMPLIANCE_FOOTER = 'Jackson M. Latimore Sr., Independent Insurance Consultant, PA License #1268820 | NIPR #21638507. Educational content only.'

const BRAND_BRAIN = {
  brand_name: 'Latimore Life & Legacy LLC',
  service_regions: 'Schuylkill, Luzerne, and Northumberland Counties in Pennsylvania',
  core_message: 'Protecting Today. Securing Tomorrow.',
  tagline: '#TheBeatGoesOn',
  tone: 'Authoritative, calm, community-focused, preparation over fear',
  local_focus: 'Schuylkill County and surrounding Coal Region communities',
}

function generatePost(day: string, type: string, audience: string, platform: string, weekDate: string): string {
  const localRef = BRAND_BRAIN.local_focus
  const region = BRAND_BRAIN.service_regions

  const templates: Record<string, string[]> = {
    'Monday': [
      `Did you know that most life insurance policies only pay out when you pass away?\n\nBut here in ${localRef}, families are dealing with something just as financially devastating — a serious illness that keeps you from working.\n\nThat's why Living Benefits matter. With the right policy, you may be able to access a portion of your death benefit while you're still alive — if you're diagnosed with a critical, chronic, or terminal illness.\n\nFor ${audience.toLowerCase()}, this isn't hypothetical. It's preparation.\n\nWant to learn more? Drop a comment or send me a message. I'm here to help — no pressure, just education.\n\n${COMPLIANCE_FOOTER}`,
      `Here's something most people in ${region} don't know about their 401(k):\n\nIf you try to access it before age 59½, you'll pay a 10% penalty PLUS state and federal taxes. That can mean losing 40–50% of your savings.\n\nAnd if you wait too long (past age 73), you'll face Required Minimum Distribution penalties.\n\nThere's a reason so many ${audience.toLowerCase()} are exploring tax-advantaged alternatives. The goal is to grow your money AND keep more of it at retirement.\n\nCurious about your options? Let's talk — no obligation, just clarity.\n\n${COMPLIANCE_FOOTER}`,
    ],
    'Tuesday': [
      `FAQ: "Do I really need life insurance if I'm young and healthy?"\n\nGreat question — and one I hear often from ${audience.toLowerCase()} right here in ${localRef}.\n\nHere's the honest answer: The best time to get life insurance is when you're young and healthy. Rates are lowest, and you lock in your insurability before any health changes.\n\nWaiting until you "need it" often means paying significantly more — or not qualifying at all.\n\nLife insurance isn't about expecting the worst. It's about preparing for it — so your family doesn't have to.\n\nHave a question? Drop it in the comments. I answer every one.\n\n${COMPLIANCE_FOOTER}`,
      `FAQ: "What's the difference between term and permanent life insurance?"\n\nFor ${audience.toLowerCase()}, this is one of the most important questions to understand.\n\nTerm insurance: Coverage for a set period (10, 20, 30 years). Lower premiums. No cash value. Great for mortgage protection and income replacement.\n\nPermanent insurance (IUL, Whole Life): Coverage for life. Builds cash value. May include Living Benefits. Can serve as a tax-advantaged savings vehicle.\n\nNeither is "better" — the right choice depends on your situation, goals, and budget.\n\nWant a free 15-minute conversation to figure out what may fit your situation? Link in bio.\n\n${COMPLIANCE_FOOTER}`,
    ],
    'Wednesday': [
      `In 2010, I was 22 years old and playing basketball at East Stroudsburg University when my heart stopped.\n\nAn AED — placed in that gym because of the Gregory W. Moyer Defibrillator Fund — saved my life.\n\nThat moment is why I do what I do.\n\nI serve ${audience.toLowerCase()} right here in ${localRef} because I know firsthand what it means when preparation is — or isn't — in place.\n\nI'm not a 1-800 number. I'm your neighbor. And I'm here to make sure your family is protected before they ever need it.\n\n#TheBeatGoesOn\n\n${COMPLIANCE_FOOTER}`,
      `When I started Latimore Life & Legacy LLC, I made a promise:\n\nNo fear-based sales. No pressure. Just education and preparation.\n\nBecause the families I serve in ${region} deserve an advisor who leads with their best interest — not a product quota.\n\nAs an independent consultant, I can shop multiple A-rated carriers to find what may actually fit your situation. Not what's easiest for me to sell.\n\nThat's the difference. And that's the standard I hold myself to every single day.\n\nProtecting Today. Securing Tomorrow. #TheBeatGoesOn\n\n${COMPLIANCE_FOOTER}`,
    ],
    'Thursday': [
      `"I already have life insurance through work — I'm covered."\n\nI hear this often from ${audience.toLowerCase()} in ${localRef}. And I understand why it feels like enough.\n\nBut here's what most people don't realize:\n\n• Group coverage typically ends when you leave your job\n• It's usually sized to your employer's budget, not your family's needs\n• Most group plans don't include Living Benefits\n\nWork coverage is a great start. But it's rarely a complete plan.\n\nWould it be worth a quick 15-minute review to see if there are any gaps? No obligation — just clarity.\n\n${COMPLIANCE_FOOTER}`,
      `"Life insurance is too expensive."\n\nThis is one of the most common objections I hear — and one of the most important to address.\n\nFor a healthy ${audience.toLowerCase().includes('young') ? 'young adult' : 'person'} in ${localRef}, $500,000 in term coverage can cost less than a pizza night with the family.\n\nLess than $1 a day.\n\nThe question isn't whether you can afford life insurance. It's whether your family can afford not to have it.\n\nRates increase every birthday. The best time to lock in your rate is today.\n\nScan the QR code or send me a message to see your options.\n\n${COMPLIANCE_FOOTER}`,
    ],
    'Friday': [
      `This week, I've been thinking about the families in ${localRef} who are one unexpected event away from a financial crisis.\n\nNot because they're irresponsible. But because life moves fast — and protection planning often gets pushed to "someday."\n\nIf you've been meaning to review your coverage, explore your options, or just ask a question — today is a good day to start.\n\nNo pressure. No sales pitch. Just a free 15-minute conversation to see where you stand.\n\n👉 Book your free assessment: [BOOKING LINK]\n\nProtecting Today. Securing Tomorrow. #TheBeatGoesOn\n\n${COMPLIANCE_FOOTER}`,
      `Happy Friday, ${localRef}! 🏡\n\nAs you head into the weekend, here's one question worth sitting with:\n\n"If something happened to me tomorrow, would my family be okay financially?"\n\nIf the answer isn't a confident yes — let's change that.\n\nI work with ${audience.toLowerCase()} across ${region} to build protection strategies that fit real budgets and real lives.\n\nTake 2 minutes this weekend to explore your options. No commitment required.\n\n👉 Get your free quote: [BOOKING LINK]\n\n#TheBeatGoesOn\n\n${COMPLIANCE_FOOTER}`,
    ],
  }

  const posts = templates[day] || templates['Monday']
  return posts[Math.floor(Math.random() * posts.length)]
}

export default function ContentToolPage() {
  const [audience, setAudience] = useState(AUDIENCE_SEGMENTS[0])
  const [platform, setPlatform] = useState(PLATFORMS[3])
  const [weekDate, setWeekDate] = useState('2026-06-16')
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState<string | null>(null)

  const generateWeeklyBatch = () => {
    setLoading(true)
    setTimeout(() => {
      const batch: Record<string, string> = {}
      POST_TYPES.forEach(pt => {
        batch[pt.day] = generatePost(pt.day, pt.type, audience, platform, weekDate)
      })
      setGenerated(batch)
      setActiveDay('Monday')
      setLoading(false)
    }, 800)
  }

  const generateSingle = (day: string, type: string) => {
    const post = generatePost(day, type, audience, platform, weekDate)
    setGenerated(prev => ({ ...prev, [day]: post }))
    setActiveDay(day)
  }

  const copyToClipboard = (text: string, day: string) => {
    navigator.clipboard.writeText(text)
    setCopied(day)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-[#2C3E50] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">AI Content System</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2">Latimore Social Content Generator</h1>
          <p className="text-gray-300">Brand-consistent, compliance-aware weekly social content for Facebook & LinkedIn</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">⚙️ Content Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Target Audience Segment</label>
                  <select
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  >
                    {AUDIENCE_SEGMENTS.map(seg => (
                      <option key={seg} value={seg}>{seg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Publishing Platform</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Week Start Date</label>
                  <input
                    type="date"
                    value={weekDate}
                    onChange={e => setWeekDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  />
                </div>

                <button
                  onClick={generateWeeklyBatch}
                  disabled={loading}
                  className="w-full bg-[#2C3E50] text-white py-3 rounded-lg font-semibold hover:bg-[#1a2a38] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : '🚀 Generate Full Week'}
                </button>
              </div>
            </div>

            {/* Brand Brain Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">🧠 Brand Brain</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div><strong className="text-[#2C3E50]">Brand:</strong> {BRAND_BRAIN.brand_name}</div>
                <div><strong className="text-[#2C3E50]">Regions:</strong> {BRAND_BRAIN.service_regions}</div>
                <div><strong className="text-[#2C3E50]">Core Message:</strong> {BRAND_BRAIN.core_message}</div>
                <div><strong className="text-[#2C3E50]">Tagline:</strong> {BRAND_BRAIN.tagline}</div>
                <div><strong className="text-[#2C3E50]">Tone:</strong> {BRAND_BRAIN.tone}</div>
              </div>
            </div>

            {/* Post Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">📅 Weekly Structure</h3>
              <div className="space-y-3">
                {POST_TYPES.map(pt => (
                  <div key={pt.day} className="flex items-start gap-3">
                    <span className="text-lg">{pt.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#2C3E50]">{pt.day} — {pt.type}</p>
                      <p className="text-xs text-gray-500">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="md:col-span-2">
            {Object.keys(generated).length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">✍️</div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Ready to Generate</h3>
                <p className="text-gray-500 text-sm">Configure your settings and click "Generate Full Week" to create 5 brand-consistent, compliance-aware social posts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Day Tabs */}
                <div className="flex flex-wrap gap-2">
                  {POST_TYPES.map(pt => (
                    <button
                      key={pt.day}
                      onClick={() => setActiveDay(pt.day)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${activeDay === pt.day ? 'bg-[#2C3E50] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                      {pt.icon} {pt.day}
                    </button>
                  ))}
                </div>

                {/* Active Post */}
                {activeDay && generated[activeDay] && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#2C3E50] px-6 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white">{activeDay} — {POST_TYPES.find(p => p.day === activeDay)?.type}</h3>
                        <p className="text-gray-300 text-xs mt-1">Platform: {platform} | Audience: {audience}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateSingle(activeDay, POST_TYPES.find(p => p.day === activeDay)?.type || '')}
                          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          🔄 Regenerate
                        </button>
                        <button
                          onClick={() => copyToClipboard(generated[activeDay], activeDay)}
                          className="bg-[#C49A6C] hover:bg-[#b8885a] text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {copied === activeDay ? '✓ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{generated[activeDay]}</pre>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
                      <span className="text-xs text-gray-500">{generated[activeDay].length} characters</span>
                      <span className="text-xs text-green-600 font-semibold">✓ Compliance footer included</span>
                    </div>
                  </div>
                )}

                {/* All Posts Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#2C3E50]">Week of {weekDate} — All Posts</h3>
                    <button
                      onClick={() => {
                        const allPosts = POST_TYPES.map(pt => `=== ${pt.day.toUpperCase()} — ${pt.type.toUpperCase()} ===\nPlatform: ${platform}\nAudience: ${audience}\n\n${generated[pt.day] || ''}`).join('\n\n---\n\n')
                        navigator.clipboard.writeText(allPosts)
                        setCopied('all')
                        setTimeout(() => setCopied(null), 2000)
                      }}
                      className="bg-[#2C3E50] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#1a2a38] transition-colors"
                    >
                      {copied === 'all' ? '✓ Copied All!' : '📋 Copy All Posts'}
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {POST_TYPES.map(pt => (
                      <div
                        key={pt.day}
                        onClick={() => setActiveDay(pt.day)}
                        className={`cursor-pointer rounded-lg p-3 text-center transition-colors ${activeDay === pt.day ? 'bg-[#2C3E50] text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="text-xl mb-1">{pt.icon}</div>
                        <p className="text-xs font-bold">{pt.day.slice(0, 3)}</p>
                        <p className={`text-xs ${activeDay === pt.day ? 'text-gray-300' : 'text-gray-500'}`}>{generated[pt.day] ? '✓ Ready' : '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}