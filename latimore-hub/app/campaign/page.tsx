'use client'

import Link from 'next/link'

export default function CampaignPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">PAHS Campaign Module</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Ethos Integration & Game Day Activation</h1>
          <p className="text-xl text-gray-300 max-w-3xl">PAHS Crimson Tide Football 2026 — Official Community Sponsorship · Ethos Direct Mail · Postcard Activation · Estate Planning Sales Integration</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {['PA DOI #1268820', 'NIPR #21638507', 'app.ethoslife.com', 'card.latimorelifelegacy.com/pahs'].map(tag => (
              <span key={tag} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Asset Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Five PAHS Campaign Assets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  {['Asset', 'Format', 'OS Role', 'Primary CTA', 'Lead Capture'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[#2C3E50] font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { asset: 'Ethos Postcard (4×6)', format: 'Print — 4×6 direct mail / handout', role: 'Game Day handout & mail drop', cta: 'Scan QR to get free quote', capture: 'QR → card.latimorelifelegacy.com/pahs → Supabase' },
                  { asset: 'Ethos Direct Mail Letter', format: 'Print — letter + inside rate card', role: 'Neighborhood mail campaign', cta: 'Scan QR / visit ethoslife.com/now', capture: 'QR → card.latimorelifelegacy.com/pahs → Supabase' },
                  { asset: 'Ethos Direct Mail Envelope', format: 'Print — outer envelope', role: 'First-impression capture', cta: '"Free rate quote inside"', capture: 'Physical mail → leads call or scan' },
                  { asset: 'Ethos Agent Playbook (25Q3)', format: 'Internal PDF — agent reference', role: 'Product knowledge + compliance', cta: 'Internal use only', capture: 'Informs script / powers carrier routing' },
                  { asset: 'Master Estate Planning Training', format: 'Internal slide deck', role: 'Estate planning upsell integration', cta: 'Free $898 estate plan offer', capture: 'Bundled with every Ethos policy conversation' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-3 font-semibold text-[#2C3E50] text-xs">{row.asset}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{row.format}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{row.role}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{row.cta}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{row.capture}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ethos Product Suite */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Ethos Product Suite — PAHS Client Routing</h2>
          <p className="text-gray-600 text-sm mb-6">The Ethos platform uses a smart-routing algorithm that automatically places each client in the right product based on their health, age, and financial profile.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { product: 'Ethos Term Life — Prime', carrier: 'Legal & General / Protective', max: '$2M', age: '20–65', best: 'Healthiest clients — Preferred Plus rates', instant: '90%+' },
              { product: 'Ethos Term Life — Choice', carrier: 'Ameritas Life', max: '$1M', age: '20–65', best: 'Good-to-fair health; includes Critical/Chronic/Terminal Illness ABR at no cost', instant: '90%+' },
              { product: 'TruStage Term Life', carrier: 'CMFG Life', max: '$300K', age: '20–69', best: 'Average-to-fair health; convertible to whole life', instant: '100%' },
              { product: 'Ethos IUL', carrier: 'Ameritas Life', max: '$1M', age: '20–65', best: 'Wealth-building clients; index-linked growth + Living Benefits rider', instant: '60%+' },
              { product: 'TruStage Advantage Whole Life', carrier: 'MEMBERS Life', max: '$100K', age: '20–85', best: 'Final expense; older clients; guaranteed issue pathway', instant: '100%' },
              { product: 'TruStage Guaranteed Acceptance WL', carrier: 'CMFG Life', max: '$25K', age: '45–80', best: 'Poor health / uninsurable clients; no health questions', instant: '100%' },
            ].map((p) => (
              <div key={p.product} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-[#2C3E50] text-sm mb-2">{p.product}</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <span><strong>Carrier:</strong> {p.carrier}</span>
                  <span><strong>Max:</strong> {p.max}</span>
                  <span><strong>Age:</strong> {p.age}</span>
                  <span><strong>Instant:</strong> {p.instant}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{p.best}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estate Planning Bundle */}
        <div className="bg-[#2C3E50] text-white rounded-xl p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🏛️</span>
            <div>
              <h2 className="text-2xl font-bold mb-2">The $898 Estate Planning Bundle</h2>
              <p className="text-gray-300 mb-4">Every eligible Ethos policy sold through your co-branded link activates a complimentary estate planning bundle — a $898 value at zero additional cost. This single benefit eliminates the #1 objection ("I'll think about it").</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  '✓ Legal Will — who gets what, who raises the kids, who manages the estate',
                  '✓ Living Trust — assets distributed over time, allocated to specific needs',
                  '✓ Power of Attorney — financial decisions if incapacitated',
                  '✓ Medical Consent — instructions for a dependent\'s medical emergencies',
                  '✓ Healthcare Directive (Living Will) — medical action instructions if incapacitated',
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-lg px-4 py-2 text-sm">{item}</div>
                ))}
              </div>
              <p className="text-[#C49A6C] text-sm mt-4 font-semibold">Traditional lawyer cost: $2,500+ | Trust & Will: $499+ | LegalZoom: $249+ | Ethos through Latimore Life & Legacy: $0</p>
              <p className="text-gray-400 text-xs mt-2">Not available in WA, SD, AK, LA. PA fully eligible ✅</p>
            </div>
          </div>
        </div>

        {/* Game Day Script */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Game Day Conversation Script</h2>
          <div className="space-y-4">
            {[
              { phase: 'OPENER (0–15 sec)', color: 'bg-blue-50 border-blue-200', text: '"Hey! Great night for football — do you have a player on the team?" OR "Scan this real quick — free quote on life insurance, takes 2 minutes from your phone."' },
              { phase: 'BRIDGE (15–30 sec)', color: 'bg-purple-50 border-purple-200', text: '"We\'re the Official Protection Partner of the Crimson Tide this year — Latimore Life & Legacy. I\'m Jackson. We specialize in protecting families right here in Schuylkill County with life insurance that actually pays out while you\'re still alive, not just when you\'re gone."' },
              { phase: 'OFFER (30–60 sec)', color: 'bg-amber-50 border-amber-200', text: 'OPTION A — Lead with Ethos speed: "We use Ethos — 100% online, no doctor, no blood test. Most people get covered in about 10 minutes from their phone."\n\nOPTION B — Lead with $898 estate plan: "Even if you\'re not sure about life insurance yet — we include a free legal will, living trust, and power of attorney with every policy. $898 value. Free."\n\nOPTION C — Lead with Living Benefits: "Did you know your life insurance can pay out while you\'re still alive? If you survive a heart attack, stroke, or cancer diagnosis, you can access your benefit to pay bills while you recover."' },
              { phase: 'DIAGNOSTIC (60–90 sec)', color: 'bg-green-50 border-green-200', text: '"Quick question — have you reviewed your life insurance in the last year or two?"\n\nIF YES: "That\'s great. A lot of people don\'t. The question is whether what you have has Living Benefits — most older policies don\'t. Would it be worth a quick 15-minute conversation to find out?"\n\nIF NO: "That\'s actually really common — people know they need it but never quite get to it. We made it about 10 minutes and no doctor. Want me to send you the link right now?"' },
              { phase: 'LEAD CAPTURE (90–120 sec)', color: 'bg-red-50 border-red-200', text: 'CLOSE A — QR: "Here — scan this QR code on this card. It goes right to our Ethos page where you can get an instant free quote. Takes about 2 minutes just to see the number. No commitment at all."\n\nCLOSE B — Phone: "What\'s the best number to text you? I\'ll send you the link right now and you can do it from your couch tonight during the second half."\n\nCLOSE C — Appointment: "I\'d love to set up a 20-minute call this week — completely free. Does [day] work for you?"' },
              { phase: 'WARM EXIT', color: 'bg-gray-50 border-gray-200', text: '"Enjoy the game. Go Tide!" [Log interaction in CRM within 15 minutes: Name, Phone/email, Interest level (Hot/Warm/Cold), Product discussed, CTA given, Source tag: Game Day — Game #]' },
            ].map((step) => (
              <div key={step.phase} className={`border rounded-lg p-4 ${step.color}`}>
                <h4 className="font-bold text-[#2C3E50] text-sm mb-2">{step.phase}</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{step.text}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Mail Waves */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Direct Mail Campaign Waves</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { wave: 'Wave 1 — Season Opener', timing: '2 weeks before first PAHS home game', audience: 'All homeowners 35–65 in primary zips', offer: 'Free rate quote + "$2/day for $1M" envelope hook', utm: '?utm_source=print&utm_campaign=wave1' },
              { wave: 'Wave 2 — Mid-Season', timing: 'Homecoming week', audience: 'Non-responders from Wave 1 + secondary zips', offer: 'Free estate planning tools ($898 value) as primary hook', utm: '?utm_source=print&utm_campaign=wave2' },
              { wave: 'Wave 3 — Season Close', timing: '2 weeks before final regular season game', audience: 'Full list re-mail + pre-retiree data append', offer: 'Rate lock urgency: "Rates increase every birthday"', utm: '?utm_source=print&utm_campaign=wave3' },
            ].map((w) => (
              <div key={w.wave} className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-[#2C3E50] mb-3">{w.wave}</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>Timing:</strong> {w.timing}</p>
                  <p><strong>Audience:</strong> {w.audience}</p>
                  <p><strong>Offer:</strong> {w.offer}</p>
                  <code className="block bg-gray-100 px-2 py-1 rounded text-xs mt-2">{w.utm}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objection Handling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Objection Handling</h2>
          <div className="space-y-4">
            {[
              { obj: '"I already have insurance through work"', resp: '"That\'s a great start — work coverage is a nice perk. But it usually ends when you leave the job, and it\'s sized to your employer\'s budget, not your family\'s needs. Also — does it have Living Benefits? Most group plans don\'t. That\'s the gap we cover."' },
              { obj: '"I can\'t afford it right now"', resp: '"I totally hear that. Here\'s what might surprise you: for a healthy person your age, $500,000 in coverage can run less than a pizza night with the family. Less than $1 a day. The question isn\'t whether you can afford it — it\'s whether your family can afford not to have it."' },
              { obj: '"I\'ll think about it"', resp: '"Absolutely — this is a real decision and I respect that. One thing to keep in mind: life insurance gets more expensive every birthday. The rate you\'d get today is lower than the rate next year. Take this card, scan the QR, get the free quote — no commitment. The number might surprise you."' },
              { obj: '"I don\'t trust insurance companies"', resp: '"I hear you — and honestly, that\'s one reason I started Latimore Life & Legacy. I\'m a cardiac arrest survivor. I know what it means to need preparation in place. I\'m not a 1-800 number — I\'m your neighbor. And the company I use, Ethos, is rated 4.8/5 on Trustpilot."' },
              { obj: '"Do I need a medical exam?"', resp: '"No — that\'s actually one of the best things about Ethos. 100% online application, no doctor, no blood test. Most people get a decision in under 10 minutes. Just a few health questions online."' },
            ].map((item, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-800">{item.obj}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">{item.resp}</p>
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