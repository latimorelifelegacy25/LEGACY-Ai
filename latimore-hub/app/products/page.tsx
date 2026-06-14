'use client'

import { useState } from 'react'
import Link from 'next/link'

const PRODUCTS = [
  {
    id: 'iul',
    name: 'Indexed Universal Life (IUL)',
    icon: '📈',
    track: 'Depth',
    trackColor: 'bg-purple-600',
    tagline: 'Grow tax-free. Access tax-free. Pass on tax-free.',
    hero: 'The flagship product of the Latimore OS. An IUL is a permanent life insurance policy with a cash value component that grows based on a stock market index (like the S&P 500) — with a 0% floor so you never lose money when the market drops.',
    carriers: ['North American Builder Plus IUL® 4', 'North American Smart Builder IUL 3', 'Ethos IUL (Ameritas)', 'Corebridge Value+ Protector'],
    how_it_works: [
      { step: '1', title: 'Pay Premium (Post-Tax)', desc: 'Premiums come from your NET paycheck — taxes already paid. This is the key difference from a 401(k).' },
      { step: '2', title: 'Cash Value Grows Indexed', desc: 'Cash value is credited based on index performance (e.g., S&P 500). Cap rate typically 10–15%. Floor is 0% — you never lose principal.' },
      { step: '3', title: 'Access Tax-Free', desc: 'Take policy loans against cash value — tax-free. The collateralized principal continues earning interest while you borrow against it.' },
      { step: '4', title: 'Pass On Tax-Free', desc: 'Death benefit transfers to beneficiaries 100% income tax-free. Cash value + death benefit = complete legacy.' },
    ],
    percs: [
      { letter: 'P', word: 'Protection', desc: 'Family protection, tax-free transfer, market loss protection' },
      { letter: 'E', word: 'Emergency', desc: 'Flexible access to cash value — no restrictions, no penalties' },
      { letter: 'R', word: 'Retirement', desc: 'Tax-free retirement income for life — 0% tax bracket' },
      { letter: 'C', word: 'College Fund', desc: 'Doesn\'t count against financial aid. Use for anything.' },
      { letter: 'S', word: 'Savings', desc: 'Average ~9% over 30 years. Take out 100% tax-free.' },
    ],
    comparison: {
      vs: '401(k)',
      iul_wins: ['Tax-free growth AND withdrawal', 'No age restrictions (59½ or 73 rules)', 'No hidden fees eating returns', 'Living Benefits — access while alive', 'No RMD requirements', 'Death benefit for family', 'Average ~9% vs 5–7% for 401k'],
      tradeoffs: ['Requires medical/financial qualification', 'Higher initial fees (worth it long-term)', 'More complex than simple 401k contribution'],
    },
    numbers: [
      { label: 'Contribution', value401k: '$525,000', valueIUL: '$420,000', note: 'IUL requires post-tax dollars' },
      { label: 'Lifetime Fees', value401k: '$394,835', valueIUL: '$54,828', note: 'IUL saves ~$340K in fees' },
      { label: 'Account Value at Retirement', value401k: '$1,066,180', valueIUL: '$1,342,351', note: 'IUL grows more despite lower contribution' },
      { label: 'Death Benefit to Family', value401k: '$852,944 (after tax)', valueIUL: '$1,842,351 (tax-free)', note: 'IUL family gets 2x more' },
      { label: 'Annual Retirement Income', value401k: '$119,078 (taxable)', valueIUL: '$119,078 (tax-free)', note: '401k requires $148K withdrawal for same net' },
      { label: 'Income Lasts Until', value401k: 'Age 75 (runs out)', valueIUL: 'Age 90+ (never runs out)', note: 'IUL provides lifetime income' },
    ],
    use_cases: ['Tax-Advantaged Retirement (LIRP)', 'College Education Funding', 'Infinite Banking & Family Banks', 'Debt Management & Consolidation', 'Living Benefits Protection', 'Business Key Person Coverage'],
    ideal_clients: ['Ages 25–55, healthy, W-2 or self-employed', 'Maxing out 401(k) and looking for additional tax-advantaged vehicle', 'Parents wanting college funding without 529 restrictions', 'Business owners wanting tax-deductible executive benefits', 'Anyone who wants tax-free retirement income'],
  },
  {
    id: 'fia',
    name: 'Fixed Index Annuity (FIA)',
    icon: '🏦',
    track: 'Depth',
    trackColor: 'bg-purple-600',
    tagline: 'Guaranteed income you cannot outlive. Principal you cannot lose.',
    hero: 'A Fixed Index Annuity is a contract with an insurance company that provides index-linked growth with a guaranteed floor of 0% — you participate in market gains but never experience market losses. The GRIPP strategy: Guarantees, Rate of Return, Indexing, Pension-like Income, Potential Bonuses.',
    carriers: ['F&G Safe Income Advantage', 'American Equity AssetShield'],
    how_it_works: [
      { step: '1', title: 'Rollover Existing Assets', desc: 'Roll over 401(k), IRA, 403(b), or 457 — NO taxes, NO penalties, NO fees. Direct carrier-to-carrier transfer.' },
      { step: '2', title: 'Potential Premium Bonus', desc: 'Many FIA products offer a bonus on the rollover amount (e.g., 10% bonus on day 1). Account-specific qualification required.' },
      { step: '3', title: 'Index-Linked Growth', desc: 'Account grows based on index performance with participation rates. 0% floor — principal is contractually protected from market loss.' },
      { step: '4', title: 'Guaranteed Lifetime Income', desc: 'Activate income rider to receive guaranteed monthly/annual income for life — regardless of account balance or market performance.' },
    ],
    gripp: [
      { letter: 'G', word: 'Guarantees', desc: 'Principal contractually protected. You will never lose a dollar to market loss.' },
      { letter: 'R', word: 'Rate of Return', desc: 'Guaranteed minimum rate plus index-linked upside. Historically 7–10% average.' },
      { letter: 'I', word: 'Indexing Strategy', desc: 'Lock in gains when market goes up. When market falls, account value is locked in.' },
      { letter: 'P', word: 'Pension-like Income', desc: 'Guaranteed income for as long as you live — you cannot outlive it.' },
      { letter: 'P', word: 'Potential Bonuses', desc: 'Premium bonuses on rollover amounts. Account-specific — ask about qualification.' },
    ],
    numbers: [
      { label: 'Age 50 Rollover', value401k: '$200,000 (market risk)', valueIUL: '$200,000 + bonus (protected)', note: 'FIA protects principal from day 1' },
      { label: 'Age 57 (7 years)', value401k: 'Variable — market dependent', valueIUL: '~$440,000 (Rule of 72 at 10%)', note: 'FIA doubles every 7 years at 10%' },
      { label: 'Age 64 (14 years)', value401k: 'Variable — market dependent', valueIUL: '~$880,000', note: 'Doubles again' },
      { label: 'Age 72 (22 years)', value401k: 'Variable — market dependent', valueIUL: '~$1,760,000', note: 'Doubles again' },
      { label: '$1M Rollover Income', value401k: '$40,000/yr (4% Rule)', valueIUL: '$100,000+/yr (never runs out)', note: 'FIA provides 2.5x more income' },
    ],
    use_cases: ['401(k)/IRA Rollover Protection', 'Guaranteed Lifetime Income', 'Pre-Retirement Asset Protection', 'Silver Tsunami Retirement Planning', 'Eliminating Sequence of Returns Risk'],
    ideal_clients: ['Pre-retirees ages 50–70 with existing retirement assets', 'Anyone who experienced 2008 or 2020 market crash and wants protection', 'Clients who cannot afford to lose retirement savings', 'Anyone who wants guaranteed income they cannot outlive', 'Clients transitioning from accumulation to distribution phase'],
    comparison: {
      vs: 'Staying in 401(k)',
      iul_wins: ['Zero market loss — principal contractually protected', 'Guaranteed lifetime income — cannot outlive it', 'No RMD requirements (annuity income)', 'Potential premium bonus on rollover', 'No annual management fees on base product', 'Death benefit to beneficiaries'],
      tradeoffs: ['Surrender charges during surrender period (typically 7–10 years)', 'Less liquidity than brokerage account', 'Growth capped by participation rates'],
    },
  },
  {
    id: 'term',
    name: 'Term Life Insurance',
    icon: '🛡️',
    track: 'Velocity',
    trackColor: 'bg-blue-600',
    tagline: 'Maximum protection. Minimum cost. Fast approval.',
    hero: 'Term life insurance provides a death benefit for a specified period (10–30 years) at the lowest possible premium. The Velocity track uses Ethos for 100% digital, no-exam approval in minutes. The most accessible entry point for families who need protection now.',
    carriers: ['Ethos Term Life — Prime (Legal & General / Protective)', 'Ethos Term Life — Choice (Ameritas — includes Living Benefits)', 'TruStage Term Life (CMFG Life)', 'John Hancock Simple Term + ROP'],
    how_it_works: [
      { step: '1', title: 'Apply Online (10 Minutes)', desc: '100% online application. No doctor. No blood test. Just health questions. Ethos smart-routes to best product.' },
      { step: '2', title: 'Instant Decision', desc: '90%+ of applicants receive instant approval. Some cases require brief review. Coverage can begin same day.' },
      { step: '3', title: 'Choose Coverage & Term', desc: 'Select coverage amount ($100K–$2M) and term length (10, 15, 20, 25, 30 years). Lock in rate for entire term.' },
      { step: '4', title: 'Pay First Premium', desc: 'Make first premium payment online. Coverage is active. Beneficiary receives death benefit tax-free if insured passes during term.' },
    ],
    living_benefits_note: 'Ethos Term Life — Choice includes Critical/Chronic/Terminal Illness Accelerated Benefit Rider (ABR) at NO additional cost. This is the most important feature for Schuylkill County clients given the region\'s heart disease mortality rate of 178 per 100,000 — nearly double the Pennsylvania state average.',
    rate_examples: [
      { profile: 'Healthy male, age 30, non-smoker', coverage: '$500,000', term: '20-year', rate: '~$20–25/month' },
      { profile: 'Healthy female, age 30, non-smoker', coverage: '$500,000', term: '20-year', rate: '~$15–20/month' },
      { profile: 'Healthy male, age 40, non-smoker', coverage: '$500,000', term: '20-year', rate: '~$35–45/month' },
      { profile: 'Healthy male, age 40, non-smoker', coverage: '$1,000,000', term: '20-year', rate: '~$60–80/month' },
    ],
    use_cases: ['Mortgage Protection', 'Income Replacement', 'Young Family Protection', 'Business Key Person (term)', 'Debt Coverage', 'College Funding Bridge'],
    ideal_clients: ['Young families ages 25–45 with mortgage and dependents', 'Anyone who needs maximum coverage at lowest cost', 'Clients who want fast approval without medical exam', 'Game day leads — convert in 10 minutes from phone', 'Clients with good-to-fair health (Choice product)'],
    comparison: {
      vs: 'No Coverage',
      iul_wins: ['Family protected from day 1', 'Mortgage paid off if breadwinner dies', 'Children\'s future secured', 'Living Benefits — access while alive (Choice)', 'Less than $1/day for $500K coverage', 'Lock in rate while young and healthy'],
      tradeoffs: ['No cash value accumulation', 'Coverage ends at term expiration', 'Rate increases significantly if renewed after term'],
    },
  },
  {
    id: 'living-benefits',
    name: 'Living Benefits',
    icon: '❤️',
    track: 'Velocity + Depth',
    trackColor: 'bg-red-600',
    tagline: 'Life insurance that pays out while you\'re still alive.',
    hero: 'Living Benefits (Accelerated Death Benefits) allow policyholders to access a portion of their death benefit while still alive upon qualifying diagnosis of a Critical, Chronic, or Terminal illness. In Schuylkill County — where heart disease mortality runs nearly double the state average — this is not a soft sell. It\'s a public health imperative.',
    carriers: ['Ethos Term Life — Choice (ABR at no cost)', 'North American Builder Plus IUL® 4 (rider)', 'North American Smart Builder IUL 3 (rider)', 'Foresters PlanRight (rider)'],
    how_it_works: [
      { step: '1', title: 'Qualifying Diagnosis', desc: 'Policyholder is diagnosed with a Critical (heart attack, stroke, cancer), Chronic (inability to perform 2 of 6 ADLs), or Terminal illness (12–24 month life expectancy).' },
      { step: '2', title: 'File Accelerated Benefit Claim', desc: 'Submit claim with physician certification. Insurance company reviews and approves qualifying diagnosis.' },
      { step: '3', title: 'Receive Lump Sum', desc: 'Access up to 90% of death benefit as a lump sum. No restrictions on use — pay medical bills, replace lost income, cover mortgage, fund care.' },
      { step: '4', title: 'Remaining Benefit', desc: 'Remaining death benefit (typically 10%) still paid to beneficiaries at death. Policy continues in force.' },
    ],
    local_context: {
      stat: '178 per 100,000',
      comparison: 'Nearly double the Pennsylvania state average',
      implication: 'For Schuylkill County families, a heart attack, stroke, or cancer diagnosis is not hypothetical. It\'s statistically likely. A hospitalization can obliterate years of savings in months. Living Benefits convert a death benefit into a living benefit — financial protection during the hardest moments of life.',
    },
    illness_types: [
      { type: 'Critical Illness', examples: 'Heart attack, stroke, cancer, major organ failure, ALS', access: 'Up to 90% of death benefit' },
      { type: 'Chronic Illness', examples: 'Inability to perform 2 of 6 Activities of Daily Living (ADLs) for 90+ days', access: 'Up to 90% of death benefit' },
      { type: 'Terminal Illness', examples: 'Life expectancy of 12–24 months as certified by physician', access: 'Up to 90% of death benefit' },
    ],
    use_cases: ['Income Replacement During Illness', 'Medical Bill Payment', 'Mortgage Protection During Recovery', 'Long-Term Care Funding', 'Family Financial Stability During Crisis'],
    ideal_clients: ['All clients — Living Benefits should be standard on every policy', 'Especially critical for Schuylkill County clients given regional health statistics', 'Clients with family history of heart disease, cancer, or stroke', 'Manufacturing/logistics workers with physical health tied to earning capacity'],
    comparison: {
      vs: 'Policy Without Living Benefits',
      iul_wins: ['Access benefit while alive — not just at death', 'No additional premium for Ethos Choice product', 'Covers the financial crisis of illness, not just death', 'Protects family from medical debt spiral', 'Preserves assets during recovery period'],
      tradeoffs: ['Reduces remaining death benefit by amount accessed', 'Requires qualifying diagnosis — not available for all conditions', 'Some products charge additional rider premium'],
    },
  },
  {
    id: 'final-expense',
    name: 'Final Expense & Mortgage Protection',
    icon: '🏠',
    track: 'Velocity',
    trackColor: 'bg-blue-600',
    tagline: 'Protect the home. Cover the costs. Leave no debt behind.',
    hero: 'Final Expense insurance covers burial costs, outstanding medical bills, and final debts — ensuring families don\'t inherit financial burdens. Mortgage Protection ensures the family home is paid off if the breadwinner passes. Both are foundational products for the Schuylkill County market where 76.3% of households are homeowners.',
    carriers: ['Foresters PlanRight Whole Life', 'TruStage Advantage Whole Life (Ethos)', 'TruStage Guaranteed Acceptance WL (Ethos)', 'Ethos Term Life (Mortgage Protection)'],
    how_it_works: [
      { step: '1', title: 'Simplified Underwriting', desc: 'No medical exam required. Answer health questions (or none for Guaranteed Acceptance). Approval in minutes.' },
      { step: '2', title: 'Permanent Coverage', desc: 'Whole life policies never expire. Premium never increases. Coverage guaranteed for life.' },
      { step: '3', title: 'Builds Cash Value', desc: 'Policy accumulates cash value over time. Can be accessed for emergencies.' },
      { step: '4', title: 'Tax-Free Death Benefit', desc: 'Beneficiary receives death benefit income tax-free. Covers funeral costs, medical bills, outstanding debts.' },
    ],
    cost_context: {
      average_funeral: '$7,000–$12,000',
      average_medical_debt: '$2,000–$5,000 (PA average)',
      coverage_needed: '$10,000–$25,000 for final expense',
      monthly_cost: '$30–$80/month for $15,000 coverage (age 60–70)',
    },
    use_cases: ['Funeral & Burial Costs', 'Outstanding Medical Bills', 'Credit Card Debt at Death', 'Mortgage Payoff (term product)', 'Small Business Debt Coverage', 'Leaving Small Legacy for Family'],
    ideal_clients: ['Seniors ages 50–85 without existing life insurance', 'Clients with health conditions who cannot qualify for traditional coverage', 'Families with high homeownership and limited liquid assets', 'Anyone who wants to ensure family doesn\'t inherit debt', 'Clients who said "I\'ll think about it" for years — this is the entry point'],
    comparison: {
      vs: 'No Coverage',
      iul_wins: ['Family doesn\'t pay $10K+ funeral costs out of pocket', 'Home protected from forced sale to cover debts', 'Medical bills don\'t transfer to surviving spouse', 'Guaranteed acceptance available for uninsurable clients', 'Affordable — less than $2/day for meaningful coverage'],
      tradeoffs: ['Lower coverage amounts than term or IUL', 'Higher cost per dollar of coverage than term', 'Graded benefit in first 2 years for some products'],
    },
  },
]

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0].id)
  const product = PRODUCTS.find(p => p.id === activeProduct) || PRODUCTS[0]

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Product Suite</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Products & Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl">Engineered solutions for complex financial challenges. We lead with problems, not products.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {PRODUCTS.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeProduct === p.id ? 'bg-[#C49A6C] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{product.icon}</span>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-[#2C3E50]">{product.name}</h2>
                  <span className={`${product.trackColor} text-white text-xs px-3 py-1 rounded-full font-semibold`}>{product.track}</span>
                </div>
                <p className="text-[#C49A6C] font-semibold italic">{product.tagline}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{product.hero}</p>
          {product.id === 'living-benefits' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-900 mb-1">📍 Schuylkill County Context</h4>
              <p className="text-sm text-red-800"><strong>{product.local_context?.stat}</strong> heart disease mortality rate — {product.local_context?.comparison}. {product.local_context?.implication}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">How It Works</h3>
            <div className="space-y-4">
              {product.how_it_works.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <span className="w-8 h-8 bg-[#2C3E50] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{step.step}</span>
                  <div>
                    <h4 className="font-semibold text-[#2C3E50] text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PERCS / GRIPP / Special Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {product.id === 'iul' && (
              <>
                <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">The PERCS Framework</h3>
                <div className="space-y-3">
                  {product.percs?.map(p => (
                    <div key={p.letter} className="flex gap-3 items-start">
                      <span className="w-8 h-8 bg-[#C49A6C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{p.letter}</span>
                      <div>
                        <span className="font-bold text-[#2C3E50] text-sm">{p.word}</span>
                        <p className="text-xs text-gray-600">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {product.id === 'fia' && (
              <>
                <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">The GRIPP Framework</h3>
                <div className="space-y-3">
                  {product.gripp?.map(p => (
                    <div key={p.letter} className="flex gap-3 items-start">
                      <span className="w-8 h-8 bg-[#C49A6C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{p.letter}</span>
                      <div>
                        <span className="font-bold text-[#2C3E50] text-sm">{p.word}</span>
                        <p className="text-xs text-gray-600">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {product.id === 'term' && (
              <>
                <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">Rate Examples</h3>
                <div className="space-y-3">
                  {product.rate_examples?.map((r, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-500">{r.profile}</p>
                      <p className="font-bold text-[#2C3E50] text-sm">{r.coverage} / {r.term}</p>
                      <p className="text-[#C49A6C] font-bold">{r.rate}</p>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 italic">*Rates subject to underwriting. Example pricing for illustrative purposes only.</p>
                </div>
                {product.living_benefits_note && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-800 font-semibold">❤️ Living Benefits Note</p>
                    <p className="text-xs text-red-700 mt-1">{product.living_benefits_note}</p>
                  </div>
                )}
              </>
            )}
            {product.id === 'living-benefits' && (
              <>
                <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">Qualifying Illness Types</h3>
                <div className="space-y-3">
                  {product.illness_types?.map((ill, i) => (
                    <div key={i} className="border-l-4 border-[#C49A6C] pl-4">
                      <h4 className="font-bold text-[#2C3E50] text-sm">{ill.type}</h4>
                      <p className="text-xs text-gray-600">{ill.examples}</p>
                      <p className="text-xs font-semibold text-green-700 mt-1">{ill.access}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {product.id === 'final-expense' && (
              <>
                <h3 className="font-bold text-[#2C3E50] mb-5 text-lg">Cost Context</h3>
                <div className="space-y-3">
                  {Object.entries(product.cost_context || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-[#2C3E50] text-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Numbers Comparison */}
        {product.numbers && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-bold text-[#2C3E50] mb-6 text-lg">
              {product.id === 'iul' ? 'IUL vs 401(k) — The Numbers' : 'FIA vs Staying in Market — The Numbers'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#2C3E50]">
                    <th className="text-left py-3 px-4 text-[#2C3E50] font-bold">Metric</th>
                    <th className="text-left py-3 px-4 text-red-700 font-bold">{product.id === 'iul' ? '401(k)' : 'Market (Variable)'}</th>
                    <th className="text-left py-3 px-4 text-green-700 font-bold">{product.id === 'iul' ? 'IUL' : 'FIA'}</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-bold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {product.numbers.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.label}</td>
                      <td className="py-3 px-4 text-red-700">{row.value401k}</td>
                      <td className="py-3 px-4 text-green-700 font-bold">{row.valueIUL}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">All figures are for illustrative purposes only and do not reflect an actual investment in any product. These depict hypothetical scenarios. Past performance does not guarantee future results.</p>
          </div>
        )}

        {/* Use Cases + Ideal Clients */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] mb-4">Primary Use Cases</h3>
            <div className="space-y-2">
              {product.use_cases.map((uc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#C49A6C] flex-shrink-0"></span>
                  {uc}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#2C3E50] mb-4">Ideal Client Profile</h3>
            <div className="space-y-2">
              {product.ideal_clients.map((ic, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                  {ic}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carriers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#2C3E50] mb-4">Available Carriers</h3>
          <div className="flex flex-wrap gap-3">
            {product.carriers.map((c, i) => (
              <span key={i} className="bg-[#2C3E50] text-white text-sm px-4 py-2 rounded-lg">{c}</span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/carriers" className="inline-flex items-center gap-2 bg-[#2C3E50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a2a38] transition-colors">
              View Carrier Details →
            </Link>
            <Link href="/personas" className="inline-flex items-center gap-2 border-2 border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View Client Personas →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}