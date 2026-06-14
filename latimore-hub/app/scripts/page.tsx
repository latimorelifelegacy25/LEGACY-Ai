'use client'

import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  { num: 1, title: 'TTHT', subtitle: 'Trainee Thanks Trainer — Edification Script', color: 'bg-blue-500' },
  { num: 2, title: 'F.O.R.M / Story', subtitle: 'Family, Occupation, Recreation, Message', color: 'bg-purple-500' },
  { num: 3, title: 'Opening Questions', subtitle: '5 Magic Opening Questions (PFR Form)', color: 'bg-indigo-500' },
  { num: 4, title: 'Presentation', subtitle: 'Strength & Credibility — GFI Overview', color: 'bg-teal-500' },
  { num: 5, title: '401(k) vs IUL', subtitle: 'Three Rules of Money', color: 'bg-green-500' },
  { num: 6, title: 'GFI Rocket Slides', subtitle: 'Apples-to-Apples Comparison (4 slides)', color: 'bg-yellow-500' },
  { num: 7, title: 'GRIPP', subtitle: 'Guarantees, Rate, Indexing, Pension, Potential', color: 'bg-orange-500' },
  { num: 8, title: 'Annuities Genius', subtitle: '4% Rule vs 10%+ Income', color: 'bg-red-500' },
  { num: 9, title: 'PFR', subtitle: 'Personal Financial Review — Client Priorities', color: 'bg-pink-500' },
  { num: 10, title: 'Book 2nd Appt', subtitle: 'Close with next steps', color: 'bg-[#2C3E50]' },
]

const STEP_CONTENT: Record<number, React.ReactNode> = {
  1: (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-3">Trainee Script</h4>
        <p className="text-sm text-blue-800 italic">"(CLIENT), before we get started. I would like to take a minute to THANK (TRAINER) for taking time away from his/her family and away from his/her business to be with us today/tonight. (TRAINER) is one of the TOP strategists at the firm and He/She has really HELPED me (with my own finances). And so, I TRUST him/her to go ahead and show you the same information that enlightened me. So, (TRAINER) THANK you again; I really appreciate you helping me out."</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-3">Trainer Response</h4>
        <p className="text-sm text-gray-700 italic">"Yes of course. Thank you, (TRAINEE)… However, I want to thank you, (CLIENT), to be here today helping out (TRAINEE). So far, (TRAINEE) has been our next up-and-comer and I know this training appointment will further help (TRAINEE) advance to the next stage in this business."</p>
      </div>
    </div>
  ),
  2: (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { letter: 'F', label: 'FAMILY', questions: ['Tell me about your Family?', 'How did you guys meet?', 'Do you come from a large family?', 'Are you originally from this area?', 'What made you move?'] },
          { letter: 'O', label: 'OCCUPATION', questions: ['Just curious what do you do for work?', 'How long have you been there?', 'Is that what you went to school for?', 'How did you end up in that field?', 'What do you like most about what you do?'] },
          { letter: 'R', label: 'RECREATION', questions: ['How do you spend your spare time?', 'What do you like to do for fun?', 'What hobbies do you have?', 'What are your kids into? Sports/extracurriculars?', 'What is your favorite sports team?'] },
          { letter: 'M', label: 'MESSAGE', questions: ['Your 2-minute personal story', 'Why you do what you do (should make you emotional)', 'Your crusade & enemy', 'How GFI helped you or your family', 'Give yourself credibility'] },
        ].map(item => (
          <div key={item.letter} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 bg-[#2C3E50] text-white rounded-full flex items-center justify-center font-bold text-lg">{item.letter}</span>
              <h4 className="font-bold text-[#2C3E50]">{item.label}</h4>
            </div>
            <ul className="space-y-1">
              {item.questions.map((q, i) => <li key={i} className="text-sm text-gray-600">• {q}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-amber-800">💡 Key Principle: "People don't care what you know until they know that you care." Go 3 deep on questions. Find common ground.</p>
      </div>
    </div>
  ),
  3: (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm mb-4">Use the PFR Form. Ask these 5 questions before transitioning to the presentation.</p>
      {[
        { q: 'Are you currently contributing to any employer retirement plan?', options: ['Yes', 'No'] },
        { q: 'Do you have any retirement plans outside of work?', options: ['401(k)', '403(b)', '457', 'TSP', 'IRA/Roth IRA'] },
        { q: 'Do you have any life insurance? Do they come with Living Benefits?', options: ['Yes — with Living Benefits', 'Yes — without Living Benefits', 'No'] },
        { q: 'Do you have any Children? Are you saving towards their future?', options: ['Yes, saving', 'Yes, not saving', 'No children'] },
        { q: 'Are you open to making additional income, or are you perfectly happy with where you\'re at?', options: ['Open to additional income', 'Happy where I am'] },
      ].map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-[#2C3E50] mb-3 text-sm">{i + 1}. {item.q}</p>
          <div className="flex flex-wrap gap-2">
            {item.options.map(opt => (
              <span key={opt} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">{opt}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="bg-[#2C3E50] text-white rounded-lg p-4">
        <p className="text-sm italic">"Ok awesome, what I'll do now is transition over to my screen and I'll walk you through a little bit about us, who we are and what we do. Does that sound good?"</p>
      </div>
    </div>
  ),
  4: (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-bold text-[#2C3E50] mb-3">Opening Statement</h4>
        <p className="text-sm text-gray-700 italic">"We work for a financial services brokerage. The broker's name is GFI Global Financial Impact and it's our job to connect you to some of the best companies in the industry."</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-bold text-[#2C3E50] mb-3">Carrier Partners Slide</h4>
        <p className="text-sm text-gray-700 italic">"We work with all grade A companies and these are the top platinum partners. Do any of these names or logos look familiar to you?"</p>
        <p className="text-sm text-gray-700 mt-2 italic">"The best part about working with us is that when we sit down with clients, we don't have to charge them for our time. Instead of charging our client, we get compensated by the companies that you see here that you choose to do business with."</p>
      </div>
      <div className="bg-[#C49A6C]/10 border border-[#C49A6C] rounded-lg p-4">
        <p className="text-sm font-semibold text-[#2C3E50]">Referral Ask: "However, if we bring value to you today, all we ask is if you can think of anybody that can benefit from anything that we do, you can send them our way. Fair enough?"</p>
      </div>
    </div>
  ),
  5: (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { rule: 'Rule 1', title: 'Compound Interest (Rule of 72)', content: '72 ÷ interest rate = years to double. Bank gives 1% → 72 years to double. Goal: earn 8–12% to double every 6–9 years. "You always want to be out earning what you\'re paying."' },
          { rule: 'Rule 2', title: 'How Money Grows', content: 'Fixed (bank — safe, low return), Variable (market — no guarantees), Indexed (gains without losses — averages ~9% over 30 years). "Up it grows, down it locks in."' },
          { rule: 'Rule 3', title: 'How Money Gets Taxed', content: 'Tax Now (bank — pay yearly), Tax Later (401k/IRA — pay at retirement when taxes may be higher), Tax Advantage (IUL/Roth — pay now, grow and withdraw TAX FREE).' },
        ].map(item => (
          <div key={item.rule} className="border-t-4 border-[#C49A6C] bg-white rounded-lg p-5 shadow-sm">
            <span className="text-xs font-bold text-[#C49A6C] uppercase">{item.rule}</span>
            <h4 className="font-bold text-[#2C3E50] mt-1 mb-3">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.content}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#2C3E50] text-white rounded-xl p-6">
        <h4 className="font-bold text-[#C49A6C] mb-3">IUL vs 401(k) — Key Differences</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-bold text-red-300 mb-2">401(k) Problems</h5>
            <ul className="space-y-1 text-gray-300">
              <li>• Pre-tax money → pay taxes at retirement (when rates may be higher)</li>
              <li>• 59½ rule: 10% penalty + taxes if withdrawn early</li>
              <li>• Age 73 rule: 25% RMD penalty if not withdrawn</li>
              <li>• Hidden fees over lifetime: ~$395K</li>
              <li>• Market loss risk — no floor</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-green-300 mb-2">IUL Advantages (PERCS)</h5>
            <ul className="space-y-1 text-gray-300">
              <li>• <strong>P</strong>rotection — family, tax-free, market loss</li>
              <li>• <strong>E</strong>mergency — flexible access to cash value</li>
              <li>• <strong>R</strong>etirement — TAX-FREE income for life</li>
              <li>• <strong>C</strong>hildren/College — doesn't count against financial aid</li>
              <li>• <strong>S</strong>avings — averages ~9% over 30 years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  6: (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">Apples-to-Apples comparison across 4 slides. Example: someone starts saving in their 30s.</p>
      {[
        { slide: 'Slide 1 — Year 1 Comparison', content: '401k: $15K contributed, $2,000 fees, beneficiary gets after-tax leftovers. IUL: $12K contributed (post-tax), $400 fees, beneficiary gets $510,000 TAX FREE + Living Benefits access up to 90% of death benefit for critical/chronic/terminal illness.' },
        { slide: 'Slide 2 — At Retirement', content: '401k: $525K contributed, $395K in fees, $1M+ growth but taxes still owed. IUL: $420K contributed, $55K in fees, $1.3M+ growth, ALL TAX FREE. Family gets $1.8M vs $850K after-tax.' },
        { slide: 'Slide 3 — Income Phase', content: '401k: Must withdraw $148K to net $120K (taxes). Creates taxable income that affects Social Security. IUL: Withdraw exactly $120K — 0% tax bracket. Maximizes Social Security benefits.' },
        { slide: 'Slide 4 — Longevity', content: '401k: Runs out of money at age 75 due to fees and taxes. IUL: TAX FREE income all the way to age 90+. At age 90, still $360K+ to pass as TAX-FREE legacy. Total: put in $420K, take out $3.3M TAX FREE.' },
      ].map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#2C3E50] px-5 py-3">
            <h4 className="font-bold text-white text-sm">{item.slide}</h4>
          </div>
          <div className="bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-700">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  ),
  7: (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm italic">"I know there's been a lot of volatility lately; there is one thing that a lot of people are doing to avoid losing money and start getting some guarantees built into their portfolio. We call it getting a GRIPP on your money."</p>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { letter: 'G', label: 'Guarantees', desc: 'You\'re never going to lose another dollar moving forward. Principal protection — no market loss.' },
          { letter: 'R', label: 'Rate of Return', desc: 'Guaranteed rate of return built into the account. Averages 10% over time with indexing strategy.' },
          { letter: 'I', label: 'Indexing Strategy', desc: 'Lock in growth when market goes up. When market falls, account value is locked in — you don\'t lose anything.' },
          { letter: 'P', label: 'Pension-like Income', desc: 'Take income for as long as you live. Guaranteed lifetime income stream — you cannot outlive it.' },
          { letter: 'P', label: 'Potential Bonuses', desc: 'Depending on the account, potential bonuses on the amount being rolled over. Account-specific qualification required.' },
        ].map(item => (
          <div key={item.label} className="flex gap-4 border border-gray-200 rounded-lg p-4">
            <span className="w-10 h-10 bg-[#C49A6C] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">{item.letter}</span>
            <div>
              <h4 className="font-bold text-[#2C3E50] text-sm">{item.label}</h4>
              <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-bold text-amber-900 mb-2">FIA Rollover Example</h4>
        <p className="text-sm text-amber-800">Age 50, rolls over $200,000 on Day 1 → gets bonus for rolling over → 7 years later doubles to $440,000 → 7 more years to $880,000 → at age 72: ~$1.7 million. No taxes, no penalties, no fees on rollover.</p>
      </div>
    </div>
  ),
  8: (
    <div className="space-y-4">
      <div className="bg-[#2C3E50] text-white rounded-xl p-6">
        <h4 className="font-bold text-[#C49A6C] mb-2">The #1 Fear of Retirees</h4>
        <p className="text-lg font-bold">Running out of money!</p>
        <p className="text-sm text-gray-300 mt-2">The 4% Rule states you shouldn't pull out more than 4% of your entire portfolio per year or you risk running out of money due to market volatility and taxes.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h4 className="font-bold text-red-800 mb-2">4% Rule (Traditional)</h4>
          <p className="text-sm text-red-700">$1,000,000 portfolio → $40,000/year income. Risk of running out due to market volatility, taxes, and inflation.</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h4 className="font-bold text-green-800 mb-2">FIA Strategy (Latimore OS)</h4>
          <p className="text-sm text-green-700">$1,000,000 rollover → $100,000+/year income. NEVER run out of money. Guaranteed lifetime income stream.</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-5">
        <h4 className="font-bold text-[#2C3E50] mb-2">Accumulation Programs</h4>
        <p className="text-sm text-gray-700">For clients still younger or who don't need income yet: accounts averaging 9.5%–12%, better than the 401k average of 5%–7%. "Does that sound like something you'd be open to looking at?"</p>
      </div>
    </div>
  ),
  9: (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">Out of these 10 Priorities, which are Important to you at this time?</p>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          'Tax-Advantaged Wealth Accumulation',
          'Asset Protection & Qualified Plan Rollovers',
          'College Education Funds ("Million Dollar Baby")',
          'Debt Management & Consolidation',
          'Infinite Banking & Family Banks',
          'Living Benefits & Final Expense',
          'Estate Planning',
          'Mortgage Protection',
          'Business Continuity Planning',
          'Retirement Income Planning',
        ].map((priority, i) => (
          <div key={i} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
            <span className="w-6 h-6 border-2 border-gray-300 rounded flex-shrink-0"></span>
            <span className="text-sm text-gray-700">{priority}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#2C3E50] text-white rounded-lg p-4">
        <p className="text-sm italic">"What age would you like to retire?" → Begin conversion conversation based on their priorities and PFR responses.</p>
      </div>
    </div>
  ),
  10: (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-bold text-green-900 mb-3">Closing the First Appointment</h4>
        <p className="text-sm text-green-800 mb-4">"So one of the things we can actually do is design an entire plan for you if you would like, but we can talk about that later no problem…"</p>
        <p className="text-sm text-green-800">"Based on what we've covered today, I'd love to put together a personalized strategy for you. Can we schedule a follow-up this week to go over the numbers?"</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Hot Lead', action: 'Book 2nd appointment before leaving. Send calendar invite immediately.', color: 'bg-red-50 border-red-200' },
          { label: 'Warm Lead', action: 'Send follow-up text within 2 hours. Book within 48 hours.', color: 'bg-yellow-50 border-yellow-200' },
          { label: 'Cold Lead', action: 'Add to nurture sequence. Follow up in 7 days with value content.', color: 'bg-blue-50 border-blue-200' },
        ].map(item => (
          <div key={item.label} className={`border rounded-lg p-4 ${item.color}`}>
            <h4 className="font-bold text-[#2C3E50] mb-2">{item.label}</h4>
            <p className="text-xs text-gray-700">{item.action}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}

export default function ScriptsPage() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">GFI Lionstar CFT</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Client Presentation Script</h1>
          <p className="text-xl text-gray-300">10-Step System — Appointment 1 | Goal: Make a Friend, Disturb & Entice</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-[#2C3E50] mb-4 text-sm uppercase tracking-wide">10 Steps</h3>
            <div className="space-y-2">
              {STEPS.map(step => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeStep === step.num ? 'bg-[#2C3E50] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 ${activeStep === step.num ? 'bg-[#C49A6C]' : step.color}`}>{step.num}</span>
                    <div>
                      <p className="font-semibold text-xs">{step.title}</p>
                      <p className={`text-xs ${activeStep === step.num ? 'text-gray-300' : 'text-gray-500'}`}>{step.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center ${STEPS[activeStep - 1].color}`}>{activeStep}</span>
                <div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">{STEPS[activeStep - 1].title}</h2>
                  <p className="text-sm text-gray-500">{STEPS[activeStep - 1].subtitle}</p>
                </div>
              </div>
              {STEP_CONTENT[activeStep]}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#2C3E50] border border-[#2C3E50] rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(10, activeStep + 1))}
                  disabled={activeStep === 10}
                  className="px-4 py-2 text-sm font-semibold bg-[#2C3E50] text-white rounded-lg disabled:opacity-30 hover:bg-[#1a2a38] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#C49A6C] font-semibold transition-colors">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}