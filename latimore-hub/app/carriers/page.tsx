'use client'

import { useState } from 'react'
import Link from 'next/link'

const CARRIERS = [
  {
    id: 'north-american',
    name: 'North American Company',
    logo: 'NA',
    color: 'bg-blue-700',
    rating: 'A+ (Superior)',
    ratingOrg: "AM Best",
    category: 'Life Insurance & IUL',
    tagline: 'Primary IUL carrier for wealth accumulation and living benefits',
    description: 'North American Company for Life and Health Insurance is Latimore\'s primary carrier for Indexed Universal Life (IUL) products. Their Builder Plus IUL® 4 is the flagship product for tax-advantaged wealth accumulation, college funding, and infinite banking strategies.',
    products: [
      {
        name: 'Builder Plus IUL® 4',
        type: 'Indexed Universal Life',
        use_cases: ['Tax-Advantaged Retirement (LIRP)', 'College Education Funding ("Million Dollar Baby")', 'Infinite Banking & Family Banks', 'Living Benefits Protection'],
        key_features: [
          'Fixed Interest Participating Policy Loan — take tax-free retirement income while collateralized principal continues earning interest',
          'Multiple index options including S&P 500 with cap rates typically 10–15%',
          '0% floor — never lose money when market goes down',
          'Living Benefits riders: Critical, Chronic, and Terminal Illness accelerated death benefit',
          'Overfunding capability for maximum cash value accumulation',
        ],
        ideal_client: 'Ages 25–55, healthy, seeking tax-free retirement income or college funding vehicle',
        positioning: '"Life Insurance Retirement Plan (LIRP)" — grow tax-deferred, access tax-free, pass on tax-free',
      },
      {
        name: 'Smart Builder IUL 3',
        type: 'Indexed Universal Life',
        use_cases: ['Debt Management & Consolidation', 'Early Cash Value Access', 'Mortgage Protection with Cash Value'],
        key_features: [
          'Waiver of Surrender Charge Option — unique feature allowing early cash value access without penalty',
          'Engineered for early liquidity — critical safety valve for families managing debt',
          'Living Benefits included',
          'Indexed growth with 0% floor',
        ],
        ideal_client: 'Families with high-interest debt or medical debt needing flexible access to cash value early in policy life',
        positioning: '"Debt Elimination Engine" — use policy cash value to consolidate toxic debt without surrender penalties',
      },
    ],
    compliance_note: 'Product availability and features subject to state approval. Illustrations are not guarantees of future performance.',
  },
  {
    id: 'fg',
    name: 'F&G (Fidelity & Guaranty Life)',
    logo: 'F&G',
    color: 'bg-green-700',
    rating: 'A- (Excellent)',
    ratingOrg: 'AM Best',
    category: 'Fixed Index Annuities',
    tagline: 'Primary FIA carrier for retirement income and asset protection',
    description: 'F&G is Latimore\'s primary carrier for Fixed Index Annuities (FIA). Their Safe Income Advantage FIA is positioned as a "Personal Pension" for pre-retirees and retirees seeking guaranteed lifetime income and principal protection from market loss.',
    products: [
      {
        name: 'Safe Income Advantage FIA',
        type: 'Fixed Index Annuity',
        use_cases: ['Asset Protection & Qualified Plan Rollovers', 'Guaranteed Lifetime Income', 'Silver Tsunami Retirement Planning', 'IRA/401(k) Rollover Vehicle'],
        key_features: [
          'Contractually guaranteed principal protection — zero market loss',
          'Guaranteed lifetime income rider — income you cannot outlive',
          'Index-linked growth potential with participation rates and caps',
          'No-fee rollover from 401(k), IRA, 403(b), 457 — no taxes, no penalties',
          'Potential premium bonus on rollover amounts (account-specific)',
          'Death benefit passes to beneficiaries',
        ],
        ideal_client: 'Pre-retirees ages 50–70 with existing 401(k)/IRA assets seeking to eliminate market risk and create guaranteed income stream',
        positioning: '"Personal Pension" — contractually guaranteed income for life, principal never at risk from market loss',
      },
    ],
    compliance_note: 'Annuity guarantees are backed by the financial strength of the issuing insurance company. Surrender charges may apply during surrender charge period.',
  },
  {
    id: 'american-equity',
    name: 'American Equity Investment Life',
    logo: 'AE',
    color: 'bg-red-700',
    rating: 'A- (Excellent)',
    ratingOrg: 'AM Best',
    category: 'Fixed Index Annuities',
    tagline: 'Secondary FIA carrier for accumulation-focused annuity strategies',
    description: 'American Equity is a secondary FIA carrier used for clients who are younger or focused on accumulation rather than immediate income. Their products offer competitive participation rates and accumulation bonuses for clients who don\'t need income for 10+ years.',
    products: [
      {
        name: 'AssetShield FIA',
        type: 'Fixed Index Annuity',
        use_cases: ['Long-Term Accumulation', 'Pre-Retirement Asset Protection', 'Tax-Deferred Growth Vehicle'],
        key_features: [
          'High participation rates on index strategies — 9.5%–12% historical performance',
          'Principal protection with 0% floor',
          'Multiple index options',
          'Accumulation bonus on premium',
          'No annual fees on base product',
        ],
        ideal_client: 'Ages 40–60 with 10+ years before retirement, seeking market-linked growth without downside risk',
        positioning: '"Accumulation Engine" — outperform 401(k) averages (5–7%) with index-linked growth and zero loss',
      },
    ],
    compliance_note: 'Past performance of index strategies does not guarantee future results. Participation rates and caps subject to change.',
  },
  {
    id: 'ethos',
    name: 'Ethos Life Insurance',
    logo: 'ETH',
    color: 'bg-purple-700',
    rating: '4.8/5 Trustpilot',
    ratingOrg: 'Consumer Rating',
    category: 'Term Life & Digital Insurance',
    tagline: 'Velocity track — fast, digital, no-exam life insurance',
    description: 'Ethos is Latimore\'s primary carrier for the Velocity track — fast, digital, no-exam life insurance. 100% online application, decisions in minutes, coverage in hours. Primary carrier for game day activations, direct mail campaigns, and digital lead conversion.',
    products: [
      {
        name: 'Ethos Term Life — Prime',
        type: 'Term Life Insurance',
        use_cases: ['Mortgage Protection', 'Income Replacement', 'Young Family Protection', 'Velocity Track Primary Product'],
        key_features: [
          'Coverage up to $2M',
          'Ages 20–65',
          '100% online — no doctor, no blood test',
          'Decision in under 10 minutes',
          'Preferred Plus rates for healthiest clients',
          'Terms: 10, 15, 20, 25, 30 years',
          'Carrier: Legal & General / Protective',
        ],
        ideal_client: 'Healthy adults ages 20–50 seeking maximum coverage at lowest possible rate with fast approval',
        positioning: '"Life insurance that\'s easier, faster, and better" — same-day coverage from your phone',
      },
      {
        name: 'Ethos Term Life — Choice',
        type: 'Term Life Insurance with Living Benefits',
        use_cases: ['Living Benefits Protection', 'Good-to-Fair Health Clients', 'Critical Illness Protection', 'PAHS Game Day Primary Product'],
        key_features: [
          'Coverage up to $1M',
          'Ages 20–65',
          'Critical/Chronic/Terminal Illness Accelerated Benefit Rider (ABR) at NO additional cost',
          '90%+ instant decision',
          'Carrier: Ameritas Life',
          'Living Benefits — access death benefit while alive for qualifying illness',
        ],
        ideal_client: 'Adults with good-to-fair health who want Living Benefits included at no extra cost — the most important product for Schuylkill County given high heart disease rates',
        positioning: '"Life insurance that pays out while you\'re still alive" — Living Benefits at no extra cost',
      },
      {
        name: 'Ethos IUL',
        type: 'Indexed Universal Life',
        use_cases: ['Wealth Building', 'Tax-Free Retirement', 'Living Benefits + Growth'],
        key_features: [
          'Coverage up to $1M',
          'Ages 20–65',
          'Index-linked growth with Living Benefits rider',
          '60%+ instant decision',
          'Carrier: Ameritas Life',
        ],
        ideal_client: 'Younger clients ages 25–45 seeking both protection and wealth accumulation in a single product',
        positioning: 'Entry-level IUL with digital convenience of Ethos platform',
      },
      {
        name: 'TruStage Guaranteed Acceptance WL',
        type: 'Guaranteed Issue Whole Life',
        use_cases: ['Final Expense', 'Uninsurable Clients', 'Poor Health Clients'],
        key_features: [
          'Coverage up to $25K',
          'Ages 45–80',
          'NO health questions — guaranteed approval',
          '100% instant decision',
          'Carrier: CMFG Life',
        ],
        ideal_client: 'Clients with serious health conditions who cannot qualify for traditional coverage — ensures everyone can get something',
        positioning: '"Good news — we have a product with no health questions at all. Guaranteed approval."',
      },
    ],
    compliance_note: 'Ethos products are underwritten by multiple carriers. Rates subject to underwriting. Example pricing for healthy, non-smoking individuals.',
  },
  {
    id: 'foresters',
    name: 'Foresters Financial',
    logo: 'FOR',
    color: 'bg-amber-700',
    rating: 'A (Excellent)',
    ratingOrg: 'AM Best',
    category: 'Life Insurance & Final Expense',
    tagline: 'Final expense and simplified issue life insurance',
    description: 'Foresters Financial provides final expense and simplified issue life insurance products for clients who need coverage but may have health challenges. Strong community focus aligns with Latimore\'s brand values.',
    products: [
      {
        name: 'PlanRight Whole Life',
        type: 'Final Expense Whole Life',
        use_cases: ['Final Expense Planning', 'Burial Cost Coverage', 'Debt Elimination at Death', 'Seniors 50–85'],
        key_features: [
          'Coverage $2,000–$35,000',
          'Ages 50–85',
          'Simplified underwriting — no medical exam',
          'Level, graded, and modified benefit options',
          'Builds cash value',
          'Member benefits included (Foresters Care)',
        ],
        ideal_client: 'Seniors ages 50–85 seeking to cover funeral costs and final expenses without burdening family',
        positioning: '"Protect your family from inheriting your debt" — affordable final expense coverage with no medical exam',
      },
    ],
    compliance_note: 'Coverage amounts and availability vary by state and age. Graded benefit policies have limited death benefit in first 2 years.',
  },
  {
    id: 'corebridge',
    name: 'Corebridge Financial (AIG)',
    logo: 'CB',
    color: 'bg-teal-700',
    rating: 'A (Excellent)',
    ratingOrg: 'AM Best',
    category: 'Life Insurance & Annuities',
    tagline: 'Supplemental carrier for complex cases and business planning',
    description: 'Corebridge Financial (formerly AIG Life & Retirement) serves as a supplemental carrier for complex cases, business planning, and clients needing specialized underwriting. Strong product portfolio for key person coverage and executive benefit plans.',
    products: [
      {
        name: 'Value+ Protector IUL',
        type: 'Indexed Universal Life',
        use_cases: ['Business Key Person Coverage', 'Executive Bonus Plans', 'Complex Case Design', 'High Net Worth Clients'],
        key_features: [
          'Competitive cap rates and participation rates',
          'Multiple index options',
          'Living Benefits riders available',
          'Strong business planning features',
          'Flexible premium structure',
        ],
        ideal_client: 'Business owners and executives needing key person coverage or executive benefit plans',
        positioning: 'Business-grade IUL for complex planning needs beyond standard consumer products',
      },
    ],
    compliance_note: 'Business insurance applications require additional documentation. Key person coverage amounts based on business valuation.',
  },
]

export default function CarriersPage() {
  const [activeCarrier, setActiveCarrier] = useState(CARRIERS[0].id)
  const [activeProduct, setActiveProduct] = useState(0)

  const carrier = CARRIERS.find(c => c.id === activeCarrier) || CARRIERS[0]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Carrier Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Carrier Buildout</h1>
          <p className="text-xl text-gray-300 max-w-3xl">Independent carrier access — shop multiple A-rated carriers to match clients with optimal products, pricing, and underwriting flexibility.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {CARRIERS.map(c => (
              <button
                key={c.id}
                onClick={() => { setActiveCarrier(c.id); setActiveProduct(0) }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCarrier === c.id ? 'bg-[#C49A6C] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Carrier Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className={`w-16 h-16 ${carrier.color} rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4`}>
                {carrier.logo}
              </div>
              <h2 className="text-xl font-bold text-[#2C3E50] mb-1">{carrier.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{carrier.category}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{carrier.rating}</span>
                <span className="text-xs text-gray-500">{carrier.ratingOrg}</span>
              </div>
              <p className="text-sm text-gray-700 italic border-l-4 border-[#C49A6C] pl-3">{carrier.tagline}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-3 text-sm uppercase tracking-wide">About</h3>
              <p className="text-sm text-gray-700">{carrier.description}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-bold text-amber-900 mb-2 text-xs uppercase tracking-wide">⚠️ Compliance Note</h3>
              <p className="text-xs text-amber-800">{carrier.compliance_note}</p>
            </div>

            {/* Product Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-3 text-sm uppercase tracking-wide">Products ({carrier.products.length})</h3>
              <div className="space-y-2">
                {carrier.products.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProduct(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${activeProduct === i ? 'bg-[#2C3E50] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className={`text-xs ${activeProduct === i ? 'text-gray-300' : 'text-gray-500'}`}>{p.type}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Detail */}
          <div className="md:col-span-2">
            {carrier.products[activeProduct] && (() => {
              const product = carrier.products[activeProduct]
              return (
                <div className="space-y-6">
                  {/* Product Header */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-[#C49A6C] uppercase tracking-widest">{product.type}</span>
                        <h2 className="text-2xl font-bold text-[#2C3E50] mt-1">{product.name}</h2>
                      </div>
                      <span className={`${carrier.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>{carrier.name}</span>
                    </div>
                    <div className="bg-[#2C3E50] text-white rounded-lg p-4">
                      <p className="text-sm font-semibold text-[#C49A6C] mb-1">Positioning Statement</p>
                      <p className="text-sm italic">{product.positioning}</p>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-[#2C3E50] mb-4">Primary Use Cases</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.use_cases.map((uc, i) => (
                        <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                          <span className="w-2 h-2 rounded-full bg-[#2C3E50] flex-shrink-0"></span>
                          <span className="text-sm text-[#2C3E50] font-medium">{uc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-[#2C3E50] mb-4">Key Features</h3>
                    <div className="space-y-3">
                      {product.key_features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-[#C49A6C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-sm text-gray-700">{f}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal Client */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">🎯 Ideal Client Profile</h3>
                    <p className="text-sm text-green-800">{product.ideal_client}</p>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Carrier Comparison Matrix */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Carrier Selection Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#2C3E50]">
                  {['Carrier', 'Rating', 'Category', 'Primary Product', 'Best For', 'Track'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[#2C3E50] font-bold text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { carrier: 'North American', rating: 'A+', category: 'IUL', product: 'Builder Plus IUL® 4', best: 'Tax-free retirement, college funding, infinite banking', track: 'Depth' },
                  { carrier: 'North American', rating: 'A+', category: 'IUL', product: 'Smart Builder IUL 3', best: 'Debt management, early liquidity needs', track: 'Depth' },
                  { carrier: 'F&G', rating: 'A-', category: 'FIA', product: 'Safe Income Advantage', best: 'Pre-retirees, 401k/IRA rollovers, guaranteed income', track: 'Depth' },
                  { carrier: 'American Equity', rating: 'A-', category: 'FIA', product: 'AssetShield', best: 'Long-term accumulation, younger pre-retirees', track: 'Depth' },
                  { carrier: 'Ethos', rating: '4.8★', category: 'Term/IUL', product: 'Term Life — Choice', best: 'Living benefits, fast approval, game day leads', track: 'Velocity' },
                  { carrier: 'Ethos', rating: '4.8★', category: 'Term', product: 'Term Life — Prime', best: 'Healthiest clients, maximum coverage, lowest rate', track: 'Velocity' },
                  { carrier: 'Ethos', rating: '4.8★', category: 'Whole Life', product: 'TruStage GA WL', best: 'Uninsurable clients, final expense, no health questions', track: 'Velocity' },
                  { carrier: 'Foresters', rating: 'A', category: 'Final Expense', product: 'PlanRight WL', best: 'Seniors 50–85, burial costs, simplified underwriting', track: 'Velocity' },
                  { carrier: 'Corebridge', rating: 'A', category: 'IUL', product: 'Value+ Protector', best: 'Business owners, key person, executive benefits', track: 'Group' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold text-[#2C3E50]">{row.carrier}</td>
                    <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">{row.rating}</span></td>
                    <td className="py-3 px-4 text-gray-600">{row.category}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{row.product}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{row.best}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.track === 'Velocity' ? 'bg-blue-100 text-blue-800' : row.track === 'Depth' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{row.track}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#C49A6C] font-semibold transition-colors">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}