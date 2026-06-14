'use client'

import { useState } from 'react'
import Link from 'next/link'

const BUSINESS_SERVICES = [
  {
    id: 'key-person',
    name: 'Key Person Coverage',
    icon: '🔑',
    tagline: 'Protect the business from the loss of its most valuable asset — the people who run it.',
    description: 'Key Person Insurance is a life insurance policy owned by the business on the life of a critical employee or owner. If that person dies or becomes disabled, the death benefit goes to the business — providing capital to survive the transition, recruit a replacement, and maintain operations.',
    why_it_matters: 'In Schuylkill County\'s small business landscape, most businesses ARE their owner. The unexpected loss of a founder, partner, or key salesperson can trigger operational chaos, financial disruption, and a crisis of community trust. Key Person coverage converts that existential risk into a manageable, funded contingency.',
    how_it_works: [
      { step: '1', title: 'Business Applies for Policy', desc: 'Business is the policy owner and beneficiary. Key employee is the insured. Business pays premiums.' },
      { step: '2', title: 'Key Employee Passes or Becomes Disabled', desc: 'Triggering event occurs — death or qualifying disability of the insured key person.' },
      { step: '3', title: 'Business Receives Death Benefit', desc: 'Business receives lump sum death benefit income tax-free. Funds are unrestricted — use for any business purpose.' },
      { step: '4', title: 'Business Survives the Transition', desc: 'Use funds to recruit replacement, cover lost revenue, pay off business debt, or fund buyout of deceased\'s interest.' },
    ],
    use_of_proceeds: [
      'Recruit and train a replacement executive or key employee',
      'Cover lost revenue during transition period (typically 6–18 months)',
      'Pay off business loans or lines of credit',
      'Fund buy-sell agreement (purchase deceased owner\'s interest)',
      'Reassure lenders, suppliers, and customers of business continuity',
      'Provide severance to employees during restructuring',
    ],
    carriers: ['Corebridge Value+ Protector IUL', 'North American Builder Plus IUL® 4', 'Ethos Term Life — Prime (up to $2M)'],
    coverage_formula: 'Typical key person coverage = 5–10x the key person\'s annual compensation, or a multiple of the revenue they generate. Business valuation analysis recommended.',
    ideal_businesses: ['Professional services firms (law, accounting, medical)', 'Construction and contracting companies', 'Manufacturing operations dependent on owner relationships', 'Sales-driven businesses where one person drives majority of revenue', 'Family businesses with succession planning needs'],
    school_district_angle: 'School districts and municipal employers face unique key person risk — the unexpected loss of a Superintendent or Business Manager can trigger operational chaos, financial disruption, and a crisis of community trust. Latimore Life & Legacy offers proactive planning solutions through carrier partnerships that may protect districts from these disruptions before they occur.',
  },
  {
    id: 'buy-sell',
    name: 'Buy-Sell Agreement Funding',
    icon: '🤝',
    tagline: 'Ensure business ownership transfers smoothly — without destroying the business or the family.',
    description: 'A Buy-Sell Agreement is a legally binding contract that governs what happens to a business owner\'s interest when they die, become disabled, or want to exit. Life insurance funds the agreement — ensuring the surviving partners have the cash to buy out the deceased\'s interest without liquidating the business.',
    why_it_matters: 'Without a funded buy-sell agreement, the death of a business partner creates a nightmare scenario: the surviving partner is now in business with the deceased\'s spouse or heirs — who may have no interest in the business and every interest in cashing out immediately. Life insurance prevents this.',
    how_it_works: [
      { step: '1', title: 'Partners Execute Buy-Sell Agreement', desc: 'Legal agreement specifies: what triggers a buyout (death, disability, retirement), the valuation method, and the purchase price formula.' },
      { step: '2', title: 'Life Insurance Funds the Agreement', desc: 'Each partner takes out a life insurance policy on the other(s). Policy death benefit equals the agreed buyout price.' },
      { step: '3', title: 'Triggering Event Occurs', desc: 'Partner dies, becomes disabled, or triggers the buyout clause.' },
      { step: '4', title: 'Smooth Ownership Transfer', desc: 'Surviving partner uses death benefit to purchase deceased\'s interest from heirs. Heirs receive fair value. Business continues without disruption.' },
    ],
    agreement_types: [
      { type: 'Cross-Purchase Agreement', desc: 'Each partner owns a policy on the other partners. Works best for 2–3 partners. Each partner\'s cost basis increases with purchase.' },
      { type: 'Entity Purchase (Stock Redemption)', desc: 'Business owns policies on all partners. Business buys out the departing partner\'s interest. Simpler administration for multiple partners.' },
      { type: 'Wait-and-See Agreement', desc: 'Hybrid approach — business has first right of refusal, then partners can purchase. Maximum flexibility.' },
    ],
    carriers: ['North American Builder Plus IUL® 4', 'Corebridge Value+ Protector IUL', 'Ethos Term Life — Prime (up to $2M)'],
    ideal_businesses: ['Two or more business partners in any industry', 'Family businesses with multiple family members as owners', 'Professional partnerships (medical, legal, accounting)', 'Any business where ownership transfer could disrupt operations'],
  },
  {
    id: 'executive-bonus',
    name: 'Executive Bonus Plans (Section 162)',
    icon: '🎯',
    tagline: 'Retain your best people with a tax-advantaged benefit they can\'t get anywhere else.',
    description: 'A Section 162 Executive Bonus Plan allows a business to pay the premium on a life insurance policy owned by a key employee. The business deducts the premium as a compensation expense. The employee owns the policy — including the cash value and death benefit. It\'s a powerful retention tool that benefits both parties.',
    why_it_matters: 'In a competitive labor market, retaining key employees is existential for small businesses. A Section 162 plan provides a benefit that large corporations offer but small businesses rarely do — creating a "golden handcuff" that makes leaving financially painful.',
    how_it_works: [
      { step: '1', title: 'Business Selects Key Employee', desc: 'Identify the employee(s) whose retention is critical to business success. No IRS discrimination rules — can be selective.' },
      { step: '2', title: 'Business Pays Premium', desc: 'Business pays IUL premium as a bonus to the employee. Business deducts premium as compensation expense (W-2 income to employee).' },
      { step: '3', title: 'Employee Owns Policy', desc: 'Employee owns the IUL policy — including growing cash value and death benefit. Policy is theirs even if they leave (after vesting period).' },
      { step: '4', title: 'Employee Builds Tax-Free Wealth', desc: 'Cash value grows tax-deferred. Employee accesses tax-free in retirement. Death benefit protects family. Business gets deduction.' },
    ],
    benefits: {
      business: ['Tax deduction for premium payments', 'Powerful retention tool — "golden handcuff"', 'No ERISA compliance requirements', 'Selective — can choose which employees receive benefit', 'Improves competitive compensation package'],
      employee: ['Owns the policy — keeps it even if they leave', 'Tax-free retirement income from cash value', 'Living Benefits protection', 'Death benefit for family', 'Grows tax-deferred — no contribution limits'],
    },
    carriers: ['North American Builder Plus IUL® 4', 'Corebridge Value+ Protector IUL'],
    ideal_businesses: ['Any business with 1–10 key employees they cannot afford to lose', 'Professional practices wanting to reward top performers', 'Family businesses wanting to provide benefits to non-family key employees', 'Businesses competing with larger employers for talent'],
  },
  {
    id: 'infinite-banking',
    name: 'Infinite Banking & Business Capital',
    icon: '🏦',
    tagline: 'Stop borrowing from banks. Start borrowing from yourself.',
    description: 'Infinite Banking (also called "Bank on Yourself" or "Becoming Your Own Banker") uses an overfunded permanent life insurance policy as a private banking system. Business owners borrow against their policy\'s cash value for business needs — equipment, inventory, expansion — and repay themselves instead of a bank.',
    why_it_matters: 'Local small business owners in Schuylkill County struggle with strict bank lending criteria and value financial autonomy. Infinite Banking provides access to capital on their terms — no credit check, no approval process, no bank involvement. And if the index credit exceeds the loan cost, they create positive arbitrage — effectively making money on their own financing.',
    how_it_works: [
      { step: '1', title: 'Overfund the IUL Policy', desc: 'Contribute maximum premium to North American Builder Plus IUL® 4. Excess premium above insurance cost goes directly to cash value. Policy is designed for maximum cash accumulation.' },
      { step: '2', title: 'Cash Value Grows Indexed', desc: 'Cash value grows based on S&P 500 index with 0% floor. Typically averages 7–9% over time. No market loss risk.' },
      { step: '3', title: 'Borrow Against Cash Value', desc: 'Take a policy loan against cash value — no credit check, no approval, no bank. Loan proceeds are tax-free. Collateralized principal continues earning index credits.' },
      { step: '4', title: 'Repay on Your Terms', desc: 'Repay the loan on your schedule. If index credit exceeds loan interest rate, you create positive arbitrage — your money earns more than the loan costs.' },
    ],
    arbitrage_example: {
      scenario: 'Business owner borrows $50,000 from policy at 5% loan interest rate',
      index_credit: 'Policy earns 9% index credit on full $50,000 (including borrowed amount)',
      net_result: 'Net gain: 9% - 5% = 4% positive arbitrage on $50,000 = $2,000/year earned while using the money',
      comparison: 'Bank loan at 8%: costs $4,000/year. Infinite Banking: earns $2,000/year. Difference: $6,000/year.',
    },
    use_cases: ['Equipment purchases', 'Inventory financing', 'Business expansion capital', 'Bridge financing between contracts', 'Real estate down payments', 'Tax payments (smooth cash flow)', 'Emergency business capital'],
    carriers: ['North American Builder Plus IUL® 4 (primary — designed for maximum cash accumulation)'],
    ideal_businesses: ['Self-employed professionals with consistent income', 'Contractors and tradespeople with equipment needs', 'Real estate investors needing flexible capital', 'Any business owner who regularly needs capital and dislikes bank dependency'],
  },
  {
    id: 'school-districts',
    name: 'School District & Municipal Expansion',
    icon: '🏫',
    tagline: 'Proactive planning for institutions that serve our community.',
    description: 'Schuylkill County school districts and municipal employers operate without formal financial contingency plans tied to key leadership. The unexpected loss of a Superintendent or Business Manager can trigger operational chaos, financial disruption, and a crisis of community trust. Latimore Life & Legacy offers proactive planning solutions through carrier partnerships with North American Company, F&G, Corebridge Financial, and Foresters Financial.',
    why_it_matters: 'School districts are among the largest employers in Schuylkill County. They serve thousands of families. And they are almost universally unprepared for the financial impact of losing key leadership. This is a unique niche with repeat contract potential and institutional credibility.',
    current_risk_landscape: [
      'Operational responsibilities may go unfilled for weeks or months, disrupting the academic calendar',
      'Financial obligations — payroll, vendor contracts, debt service — face delays without clear authority',
      'Parent backlash and media scrutiny erode community trust in the district\'s board and administration',
      'No funded succession plan means reactive, expensive emergency hiring',
    ],
    latimore_solution: [
      'Provide financial continuity in the event of unexpected leadership loss',
      'Fund transition costs, interim leadership, and recruiting expenses',
      'Demonstrate to parents and the community that the district plans proactively — not reactively',
      'Supplement existing benefits packages for key administrators',
    ],
    implementation_steps: [
      { step: '1', title: 'Initial Discovery Meeting', desc: '30-minute no-obligation conversation with the Superintendent and/or Business Manager. Identify key personnel and current coverage gaps.' },
      { step: '2', title: 'Risk Assessment', desc: 'Written summary of identified gaps and available solutions, tailored to district size and budget. Presented to administration.' },
      { step: '3', title: 'Board Presentation', desc: 'One-page summary suitable for a school board meeting agenda. Compliance-reviewed language. No product performance promises.' },
      { step: '4', title: 'Implementation', desc: 'Carrier application, onboarding, and annual review schedule. Ongoing relationship with district administration.' },
    ],
    target_districts: ['Pottsville Area School District (PAHS)', 'Minersville Area School District', 'Schuylkill Haven Area School District', 'Mahanoy Area School District', 'North Schuylkill School District', 'Blue Mountain School District', 'Luzerne County school districts', 'Northumberland County school districts'],
    carriers: ['North American Company', 'F&G', 'Corebridge Financial', 'Foresters Financial'],
    pilot_strategy: 'PAHS is the pilot. The blueprint scales to every school with an active booster program in Schuylkill, Luzerne, and Northumberland Counties. Proactive outreach to Blue Devil \'26 and other regional programs is already underway.',
  },
]

export default function BusinessPage() {
  const [activeService, setActiveService] = useState(BUSINESS_SERVICES[0].id)
  const service = BUSINESS_SERVICES.find(s => s.id === activeService) || BUSINESS_SERVICES[0]

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#2C3E50] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#C49A6C] text-sm font-semibold uppercase tracking-widest">Business Services</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Business Planning & Institutional Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl">Advanced solutions for business owners, key employees, and institutional clients in the Tri-County region.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {BUSINESS_SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeService === s.id ? 'bg-[#C49A6C] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Service Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{service.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-[#2C3E50]">{service.name}</h2>
              <p className="text-[#C49A6C] font-semibold italic mt-1">{service.tagline}</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{service.description}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-amber-900 mb-1 text-sm">Why It Matters for Schuylkill County</h4>
            <p className="text-sm text-amber-800">{service.why_it_matters}</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-[#2C3E50] text-lg mb-6">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {(service.how_it_works ?? service.implementation_steps)?.map((step) => (
              <div key={step.step} className="flex gap-4">
                <span className="w-10 h-10 bg-[#2C3E50] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{step.step}</span>
                <div>
                  <h4 className="font-semibold text-[#2C3E50]">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service-Specific Content */}
        {service.id === 'key-person' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">Use of Proceeds</h3>
              <div className="space-y-2">
                {service.use_of_proceeds?.map((u, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 flex-shrink-0">✓</span>{u}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-900">Coverage Formula</p>
                <p className="text-xs text-blue-800 mt-1">{service.coverage_formula}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">School District Application</h3>
              <div className="bg-[#2C3E50] text-white rounded-lg p-4">
                <p className="text-sm">{service.school_district_angle}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-[#2C3E50] mb-2 text-sm">Ideal Businesses</h4>
                {service.ideal_businesses?.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1">
                    <span className="text-[#C49A6C] flex-shrink-0">→</span>{b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {service.id === 'buy-sell' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-bold text-[#2C3E50] text-lg mb-6">Agreement Types</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {service.agreement_types?.map((at, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-[#2C3E50] mb-2">{at.type}</h4>
                  <p className="text-sm text-gray-600">{at.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.id === 'executive-bonus' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-4">✅ Benefits to Business</h3>
              {service.benefits?.business.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-800 mb-2">
                  <span className="flex-shrink-0">•</span>{b}
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-4">✅ Benefits to Employee</h3>
              {service.benefits?.employee.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-800 mb-2">
                  <span className="flex-shrink-0">•</span>{b}
                </div>
              ))}
            </div>
          </div>
        )}

        {service.id === 'infinite-banking' && service.arbitrage_example && (
          <div className="bg-[#2C3E50] text-white rounded-xl p-8">
            <h3 className="font-bold text-[#C49A6C] text-lg mb-4">💰 Positive Arbitrage Example</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-300">Scenario</p>
                  <p className="text-sm font-semibold">{service.arbitrage_example.scenario}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-300">Index Credit</p>
                  <p className="text-sm font-semibold text-green-300">{service.arbitrage_example.index_credit}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-300">Net Result</p>
                  <p className="text-sm font-semibold text-[#C49A6C]">{service.arbitrage_example.net_result}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-300">vs Bank Loan</p>
                  <p className="text-sm font-semibold text-green-300">{service.arbitrage_example.comparison}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {service.id === 'school-districts' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">Current Risk Landscape</h3>
              {service.current_risk_landscape?.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-2 mb-2">
                  <span className="flex-shrink-0 font-bold">!</span>{r}
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-[#2C3E50] mb-4">Target Districts</h3>
              <div className="space-y-1">
                {service.target_districts?.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#C49A6C]">🏫</span>{d}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#2C3E50] text-white rounded-lg p-3">
                <p className="text-xs font-bold text-[#C49A6C] mb-1">Pilot Strategy</p>
                <p className="text-xs">{service.pilot_strategy}</p>
              </div>
            </div>
          </div>
        )}

        {/* Carriers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#2C3E50] mb-4">Carrier Partners</h3>
          <div className="flex flex-wrap gap-3">
            {service.carriers.map((c, i) => (
              <span key={i} className="bg-[#2C3E50] text-white text-sm px-4 py-2 rounded-lg">{c}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#2C3E50] text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Discuss Business Planning?</h3>
          <p className="text-gray-300 mb-6">Schedule a free 30-minute consultation to explore how these strategies may apply to your business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/consult" className="bg-[#C49A6C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b8885a] transition-colors">
              Schedule Free Consultation
            </Link>
            <Link href="/carriers" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              View Carrier Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}