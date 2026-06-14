'use client'

import { useState } from 'react'
import Link from 'next/link'

const PERSONAS = [
  {
    id: 'silver-tsunami',
    name: 'The Silver Tsunami',
    subtitle: 'Pre-Retirees & Retirees',
    icon: '🌊',
    age: '55–75',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    population: '65+ cohort grew +13% (2010–2022) in Schuylkill County',
    core_motivation: '"Security at all costs" — protecting assets from market risk and generating guaranteed lifetime income they cannot outlive.',
    profile: {
      demographics: 'Ages 55–75, approaching or in retirement. Often blue-collar background — manufacturing, mining, logistics, education. Homeowners (76.3% rate). Median income $66,901.',
      financial_situation: 'Asset-rich, cash-constrained. Primary wealth stored in home equity and 401(k)/IRA. Limited liquid buffer. Acute fear of market crash decimating life savings at the moment they need them most.',
      health_context: 'Heart disease mortality 178/100K — nearly double state average. High probability of health event becoming financial event. Living Benefits are not optional for this segment.',
      emotional_drivers: ['Fear of outliving their money', 'Fear of market crash at retirement', 'Desire for predictable, guaranteed income', 'Want to leave something for children/grandchildren', 'Don\'t want to be a burden on family'],
    },
    pain_points: [
      '401(k) subject to market volatility — one crash could wipe out years of savings',
      'RMD requirements force withdrawals at potentially bad times',
      'Social Security alone won\'t cover expenses',
      'Medical costs increasing — no protection if serious illness strikes',
      'No guaranteed income stream — fear of running out of money',
    ],
    recommended_products: [
      { product: 'F&G Safe Income Advantage FIA', reason: 'Contractually guaranteed principal protection + guaranteed lifetime income. The "Personal Pension" they never had.' },
      { product: 'American Equity AssetShield FIA', reason: 'For clients 10+ years from income need — maximize accumulation with index-linked growth.' },
      { product: 'Ethos Term Life — Choice', reason: 'Living Benefits rider at no cost — critical given regional health statistics.' },
      { product: 'North American Builder Plus IUL® 4', reason: 'For healthier clients 55–65 who want tax-free supplemental retirement income.' },
    ],
    conversation_opener: '"Have you reviewed your retirement strategy in the last 12–18 months? With everything happening in the market, a lot of people your age are moving their 401(k) into something with a guaranteed floor — so they never lose another dollar to market loss. Would it be worth a quick 15-minute conversation to see what that might look like for you?"',
    objection_responses: [
      { objection: '"I\'m already retired — it\'s too late."', response: '"It\'s actually never too late to protect what you have. Even if you\'re already drawing income, we can look at protecting the assets you haven\'t touched yet. A rollover can happen at any age."' },
      { objection: '"My financial advisor handles everything."', response: '"That\'s great — I\'m not here to replace your advisor. I specialize specifically in guaranteed income products that many advisors don\'t offer. Would it be worth a second opinion on the income protection piece?"' },
    ],
    utm_tag: 'silver-tsunami',
  },
  {
    id: 'sandwich-generation',
    name: 'The Sandwich Generation',
    subtitle: 'Working-Age Adults with Dual Caregiving',
    icon: '🥪',
    age: '35–54',
    color: 'bg-purple-700',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    population: '35–49 cohort declined -18% in Schuylkill County — those remaining carry maximum financial pressure',
    core_motivation: 'Comprehensive income protection and living benefits — simultaneously supporting children and aging parents with zero financial margin for error.',
    profile: {
      demographics: 'Ages 35–54, working full-time. Supporting children at home AND aging parents. Homeowners with mortgage. Dual income households common but stretched thin.',
      financial_situation: '"Asset-rich, cash-constrained" paradox at its worst. Mortgage, car payments, children\'s activities, aging parent care costs. Zero liquid buffer. One health event = financial crisis.',
      health_context: 'Prime working age but high-stress lifestyle. Physical health directly tied to earning capacity. A disability or serious illness doesn\'t just affect health — it immediately eliminates income.',
      emotional_drivers: ['Terror of leaving children without a parent AND without financial support', 'Guilt about not having coverage "yet"', 'Overwhelm — too many financial priorities', 'Desire to protect the home above all else', 'Want to give children opportunities they didn\'t have'],
    },
    pain_points: [
      'No life insurance or inadequate coverage from employer',
      'Mortgage would be unmanageable if one income disappears',
      'No emergency fund — living paycheck to paycheck despite decent income',
      'Children\'s college funding not started',
      'Aging parents may need financial support — adding to burden',
      'Group life insurance ends if they lose job',
    ],
    recommended_products: [
      { product: 'Ethos Term Life — Choice (Living Benefits)', reason: 'Maximum coverage at lowest cost. Living Benefits included at no extra cost — critical for this segment.' },
      { product: 'North American Builder Plus IUL® 4', reason: 'For clients who can afford more — builds cash value for college funding AND provides living benefits AND retirement income.' },
      { product: 'North American Smart Builder IUL 3', reason: 'For clients with existing debt — early liquidity feature allows debt consolidation while building protection.' },
      { product: 'Ethos Term Life — Prime', reason: 'For healthiest clients wanting maximum coverage at absolute lowest rate.' },
    ],
    conversation_opener: '"Quick question — if something happened to you tomorrow, would your family be able to keep the house? Most families I talk to in Schuylkill County are one paycheck away from that being a real problem. We made it really simple — 10 minutes, no doctor, no blood test. Want me to show you what $500,000 in coverage would cost for someone your age?"',
    objection_responses: [
      { objection: '"I can\'t afford it right now."', response: '"I totally hear that. Here\'s what might surprise you: for someone your age and health, $500,000 in coverage can run less than a pizza night with the family. Less than $1 a day. The question isn\'t whether you can afford it — it\'s whether your family can afford not to have it."' },
      { objection: '"I have coverage through work."', response: '"That\'s a great start. But work coverage typically ends when you leave the job, and it\'s sized to your employer\'s budget, not your family\'s needs. Also — does it have Living Benefits? Most group plans don\'t. That\'s the gap we cover."' },
    ],
    utm_tag: 'sandwich-generation',
  },
  {
    id: 'underprotected-workforce',
    name: 'The Underprotected Workforce',
    subtitle: 'Manufacturing, Logistics & Blue-Collar Workers',
    icon: '🏭',
    age: '30–55',
    color: 'bg-orange-700',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    population: 'Manufacturing & logistics are primary employment sectors in Schuylkill, Luzerne & Northumberland Counties',
    core_motivation: 'Filling the retirement gap with supplemental, tax-advantaged savings vehicles that are protected from market loss and future tax increases.',
    profile: {
      demographics: 'Ages 30–55, union and non-union manufacturing/logistics workers. Steady W-2 income. Often have employer 401(k) with match but no additional retirement planning. Physical health tied directly to earning capacity.',
      financial_situation: 'Significant retirement gap — 401(k) alone won\'t be enough. Limited financial literacy about alternatives. Often unaware of tax-advantaged options beyond 401(k). Vulnerable to disability — physical job means injury = income loss.',
      health_context: 'Physical labor increases injury and disability risk. Heart disease and occupational health risks elevated. Living Benefits are mission-critical — a back injury or heart attack doesn\'t just affect health, it eliminates income immediately.',
      emotional_drivers: ['Don\'t want to work until they die', 'Want to retire at 60, not 70', 'Distrust of financial industry — want straight talk', 'Proud of what they\'ve built — want to protect it', 'Worried about taxes eating retirement savings'],
    },
    pain_points: [
      '401(k) is their only retirement vehicle — no diversification',
      'Don\'t understand 401(k) rules, penalties, and taxes',
      'Physical job means disability risk is real and immediate',
      'No supplemental income protection if injured',
      'Taxes will be higher at retirement — 401(k) is a tax time bomb',
      'Hidden fees in 401(k) eating returns over decades',
    ],
    recommended_products: [
      { product: 'North American Builder Plus IUL® 4', reason: 'Positioned as "Life Insurance Retirement Plan (LIRP)" — supplement 401(k) with tax-free retirement income. No age restrictions, no RMDs, no hidden fees.' },
      { product: 'F&G Safe Income Advantage FIA', reason: 'For workers approaching retirement — roll over 401(k) into guaranteed income stream with zero market risk.' },
      { product: 'Ethos Term Life — Choice', reason: 'Mortgage protection + Living Benefits. If injury or illness strikes, access death benefit while alive.' },
    ],
    conversation_opener: '"On a scale of 1 to 10 — 10 meaning you could teach a class — how well do you understand the rules, regulations, penalties, and taxes in your 401(k)? Most people I talk to are at a 2 or 3. Let me get you to a 10 in about 5 minutes. Does that sound good?"',
    objection_responses: [
      { objection: '"I already have a 401(k) — I\'m good."', response: '"That\'s a great start. But here\'s what most people don\'t know: if you touch that money before 59½, you lose 40–50% to penalties and taxes. And if you wait too long past 73, you\'re forced to take it out and pay taxes anyway. I want to show you an alternative where you don\'t deal with any of those rules."' },
      { objection: '"I don\'t trust insurance companies."', response: '"I hear you — and honestly, that\'s one reason I started Latimore Life & Legacy. I\'m a cardiac arrest survivor. I know what it means to need preparation in place. I\'m not a 1-800 number — I\'m your neighbor. And the carriers I work with are A-rated companies that have been paying claims for decades."' },
    ],
    utm_tag: 'underprotected-workforce',
  },
  {
    id: 'hispanic-community',
    name: 'The Emerging Hispanic Community',
    subtitle: 'Young Families — Foundational Wealth Building',
    icon: '🌱',
    age: '25–45',
    color: 'bg-green-700',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
    population: 'Hispanic population grew +200% since 2010 — now ~8% of Schuylkill County. Fastest-growing demographic.',
    core_motivation: 'Foundational wealth-building goals — mortgage protection to secure the family home and college funding to ensure upward mobility for children.',
    profile: {
      demographics: 'Ages 25–45, young families. First or second generation. Strong family values and community ties. Often first in family to own home. Aspirational — focused on building something lasting.',
      financial_situation: 'Building from scratch — mortgage is primary asset and primary vulnerability. Limited existing insurance coverage. Strong savings ethic but limited knowledge of financial products. Value flexibility over restrictions (prefer IUL over 529 for college funding).',
      health_context: 'Generally younger and healthier — best time to lock in insurance rates. Family-first orientation means protection of family is paramount motivator.',
      emotional_drivers: ['Protect the home — it represents everything they\'ve worked for', 'Give children opportunities they didn\'t have', 'Build generational wealth — break the cycle', 'Distrust of complex financial products — want simplicity and trust', 'Community-oriented — referrals from trusted community members carry enormous weight'],
    },
    pain_points: [
      'No life insurance — never been approached in a culturally competent way',
      'Mortgage is unprotected — one death = family loses home',
      'No college savings plan for children',
      'Limited financial literacy in English — need clear, simple explanations',
      'Distrust of financial industry — fear of being sold something they don\'t understand',
    ],
    recommended_products: [
      { product: 'Ethos Term Life — Choice', reason: 'Mortgage protection + Living Benefits. Fast, digital, no exam. Affordable for young families. Living Benefits critical for family breadwinner.' },
      { product: 'North American Builder Plus IUL® 4 (Juvenile Policy)', reason: '"Million Dollar Baby" — juvenile IUL for college funding. Decades of tax-advantaged compounding. Cash value accessible for any purpose — college, down payment, business. Locks in child\'s insurability for life.' },
      { product: 'Ethos Term Life — Prime', reason: 'For healthiest young clients — maximum coverage at absolute lowest rate. Lock in rate while young.' },
    ],
    conversation_opener: '"If something happened to you tomorrow, would your family be able to keep the house? I work with a lot of families right here in Schuylkill County who are in the same situation — they\'ve worked hard to get that mortgage, and they want to make sure their family never has to leave. We made it really simple — 10 minutes, no doctor. Want to see what it would cost?"',
    objection_responses: [
      { objection: '"We\'ll think about it."', response: '"I completely understand. One thing to keep in mind — life insurance gets more expensive every birthday. The rate you\'d get today is lower than the rate next year. And if your health changes, you might not qualify at all. Take this card, scan the QR, get the free quote — no commitment. The number might surprise you."' },
      { objection: '"We don\'t have money for that right now."', response: '"I hear you. For a young, healthy family, $500,000 in coverage can cost less than $1 a day. That\'s less than a coffee. The question is — what would happen to your family\'s home if something happened to you? That\'s the conversation worth having."' },
    ],
    utm_tag: 'hispanic-community',
  },
  {
    id: 'small-business',
    name: 'Small Business Owners',
    subtitle: 'Business Continuity, Key Person & Infinite Banking',
    icon: '🏢',
    age: '35–60',
    color: 'bg-[#2C3E50]',
    lightColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    population: 'Small businesses are primary employers in Schuylkill County — retail, service, construction, healthcare, professional services',
    core_motivation: 'Business continuity, talent retention, and access to working capital — ensuring the enterprise they\'ve built can survive unforeseen events.',
    profile: {
      demographics: 'Ages 35–60, business owners across all sectors. Often sole proprietors or small partnerships. Business is primary asset AND primary income source. Personal and business finances often intertwined.',
      financial_situation: 'Business value tied to owner\'s continued involvement. No succession plan. No key person coverage. Personal savings at risk if business fails. Often using personal credit for business needs — high-interest debt.',
      health_context: 'Business owner health = business survival. If owner is incapacitated, business may fail. Key person coverage protects business from this risk. Living Benefits provide income replacement during recovery.',
      emotional_drivers: ['Built something from nothing — want to protect it', 'Employees depend on them — feel responsibility', 'Want to pass business to children or sell at maximum value', 'Need access to capital without bank restrictions', 'Want tax advantages available to business owners'],
    },
    pain_points: [
      'No key person coverage — business would fail if owner died or became disabled',
      'No buy-sell agreement funded with life insurance',
      'High-interest business debt limiting growth',
      'No executive benefit plan to retain key employees',
      'Personal savings at risk if business fails',
      'Bank lending criteria too strict — need alternative capital access',
    ],
    recommended_products: [
      { product: 'North American Builder Plus IUL® 4 (Infinite Banking)', reason: '"Family Bank" strategy — overfund IUL to create private capital pool. Borrow against policy for equipment, inventory, or expansion. If index credit exceeds loan cost, create positive arbitrage — make money on your own financing.' },
      { product: 'Corebridge Value+ Protector IUL (Key Person)', reason: 'Key person coverage — business owns policy on owner/key employee. Death benefit protects business from financial loss. Cash value builds as business asset.' },
      { product: 'North American Builder Plus IUL® 4 (Executive Bonus)', reason: 'Section 162 Executive Bonus Plan — business deducts premium as compensation expense. Key employee owns policy. Powerful retention tool.' },
      { product: 'F&G Safe Income Advantage FIA', reason: 'For business owners approaching exit — roll over business sale proceeds or retirement assets into guaranteed lifetime income.' },
    ],
    conversation_opener: '"Do you know any local business owners near you? [Client responds] Perfect, because we work with a lot of them. One of the biggest things we help business owners with is something called Infinite Banking — it\'s a different way to access capital where you don\'t have to go to a bank, you don\'t lose your money, and you have access to it tax-free. Have you heard of that before?"',
    objection_responses: [
      { objection: '"I use my business line of credit for capital."', response: '"That\'s common — and it works. But here\'s the difference: with a business line of credit, you\'re paying the bank interest. With Infinite Banking, you\'re borrowing from your own policy. If the index credit exceeds your loan cost, you\'re actually making money on your own financing. Would it be worth 15 minutes to see how that works?"' },
      { objection: '"I don\'t need life insurance — my business is my retirement."', response: '"That\'s actually exactly why you need it. If something happened to you, what happens to the business? Who buys out your partner? Who pays your employees while the business transitions? Key person coverage and a funded buy-sell agreement are what protect the value you\'ve built."' },
    ],
    utm_tag: 'small-business',
  },
]

export default function PersonasPage() {
  const [activePersona, setActivePersona] = useState(PERSONAS[0].id)
  const persona = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0]

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Market Segments</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Client Personas</h1>
          <p className="text-xl text-gray-300 max-w-3xl">Five distinct, high-potential market segments in the Tri-County region — each with unique core motivations, pain points, and recommended solutions.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activePersona === p.id ? 'bg-[#C49A6C] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Persona Header */}
        <div className={`${persona.lightColor} border ${persona.borderColor} rounded-xl p-8`}>
          <div className="flex items-start gap-6">
            <span className="text-6xl">{persona.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[#2C3E50]">{persona.name}</h2>
                <span className={`${persona.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>Ages {persona.age}</span>
              </div>
              <p className="text-gray-600 font-medium mb-3">{persona.subtitle}</p>
              <p className="text-xs text-gray-500 mb-4">📍 {persona.population}</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-[#2C3E50] mb-1">Core Motivation</p>
                <p className="text-sm text-gray-700 italic">{persona.core_motivation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="font-bold text-[#2C3E50] text-lg">Persona Profile</h3>
            {[
              { label: 'Demographics', content: persona.profile.demographics },
              { label: 'Financial Situation', content: persona.profile.financial_situation },
              { label: 'Health Context', content: persona.profile.health_context },
            ].map(item => (
              <div key={item.label}>
                <h4 className="text-xs font-bold text-[#C49A6C] uppercase tracking-wide mb-1">{item.label}</h4>
                <p className="text-sm text-gray-700">{item.content}</p>
              </div>
            ))}
            <div>
              <h4 className="text-xs font-bold text-[#C49A6C] uppercase tracking-wide mb-2">Emotional Drivers</h4>
              <ul className="space-y-1">
                {persona.profile.emotional_drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#C49A6C] flex-shrink-0">→</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pain Points */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] text-lg mb-4">Pain Points</h3>
            <div className="space-y-3">
              {persona.pain_points.map((pp, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 rounded-lg p-3">
                  <span className="text-red-500 flex-shrink-0 font-bold">!</span>
                  <p className="text-sm text-red-800">{pp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-[#2C3E50] text-lg mb-6">Recommended Products</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {persona.recommended_products.map((rp, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-[#2C3E50] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-sm">{rp.product}</h4>
                    <p className="text-xs text-gray-600 mt-1">{rp.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Opener */}
        <div className="bg-[#2C3E50] text-white rounded-xl p-8">
          <h3 className="font-bold text-[#C49A6C] mb-4 text-lg">💬 Conversation Opener</h3>
          <p className="text-sm italic leading-relaxed">{persona.conversation_opener}</p>
        </div>

        {/* Objection Responses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-[#2C3E50] text-lg mb-6">Objection Handling</h3>
          <div className="space-y-4">
            {persona.objection_responses.map((or_, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-red-700 uppercase mb-1">Objection</p>
                  <p className="text-sm text-red-800 italic">{or_.objection}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Response</p>
                  <p className="text-sm text-green-800">{or_.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Personas Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-[#2C3E50] text-lg mb-6">All Segments Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  {['Segment', 'Age', 'Core Motivation', 'Primary Product', 'Entry Point'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[#2C3E50] font-bold text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { segment: '🌊 Silver Tsunami', age: '55–75', motivation: 'Security at all costs', product: 'F&G FIA — Personal Pension', entry: 'IRA/401k rollover conversation' },
                  { segment: '🥪 Sandwich Generation', age: '35–54', motivation: 'Income protection + living benefits', product: 'Ethos Term — Choice', entry: '"Would your family keep the house?"' },
                  { segment: '🏭 Underprotected Workforce', age: '30–55', motivation: 'Fill retirement gap, tax-free', product: 'North American IUL (LIRP)', entry: '"Rate your 401k knowledge 1–10"' },
                  { segment: '🌱 Hispanic Community', age: '25–45', motivation: 'Mortgage protection + college', product: 'Ethos Term + Juvenile IUL', entry: 'Community trust + referral network' },
                  { segment: '🏢 Small Business Owners', age: '35–60', motivation: 'Business continuity + capital', product: 'IUL Infinite Banking + Key Person', entry: '"Do you know any business owners?"' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.segment}</td>
                    <td className="py-3 px-4 text-gray-600">{row.age}</td>
                    <td className="py-3 px-4 text-gray-700 text-xs">{row.motivation}</td>
                    <td className="py-3 px-4 text-gray-700 text-xs">{row.product}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs italic">{row.entry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#2C3E50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a2a38] transition-colors">
              View Products →
            </Link>
            <Link href="/business" className="inline-flex items-center gap-2 border-2 border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Business Services →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}