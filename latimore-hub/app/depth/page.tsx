import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Retirement Planning - IUL/FIA Consultations | Latimore Life & Legacy',
  description: 'Tax-advantaged wealth accumulation strategies using indexed universal life insurance and fixed index annuities for secure retirement income.',
}

export default function DepthPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-white section-padding">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                    <span className="text-sm font-medium">Depth Path</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-balance">
                    Retirement Planning
                    <br />
                    <span className="text-accent-400">IUL/FIA Consultations</span>
                  </h1>
                  <p className="text-xl text-gray-200">
                    Tax-advantaged wealth accumulation strategies using indexed universal life insurance 
                    and fixed index annuities for secure retirement income that you can't outlive.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                    Schedule Deep Dive
                  </Link>
                  <Link href="/book" className="btn btn-outline text-lg px-8 py-4">
                    Free Consultation
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80"
                    alt="Retirement planning and financial security"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Strategies */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Advanced Wealth Accumulation Strategies
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Move beyond traditional retirement accounts with tax-advantaged strategies that provide 
                principal protection, growth potential, and flexible access to your money.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="card">
                  <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                    <div className="w-8 h-8 border-2 border-white rounded-circle relative">
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4">Indexed Universal Life (IUL)</h3>
                  <p className="text-gray-700 mb-6">
                    Life Insurance Retirement Plans (LIRPs) that combine death benefit protection with 
                    tax-advantaged cash accumulation linked to market index performance.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Tax-free retirement income potential</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Principal protection with upside potential</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>No contribution limits like 401(k)s</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Asset protection from creditors</span>
                    </li>
                  </ul>
                </div>

                <div className="card">
                  <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                    <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4">Fixed Index Annuities (FIA)</h3>
                  <p className="text-gray-700 mb-6">
                    Personal pension alternatives that provide guaranteed lifetime income with the potential 
                    for growth based on market index performance.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Guaranteed lifetime income options</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Principal protection from market loss</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Tax-deferred growth potential</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>No market risk to principal</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6">The Retirement Gap Challenge</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Traditional Pension Coverage</span>
                      <span className="text-2xl font-bold text-red-600">13%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">401(k) Participation Rate</span>
                      <span className="text-2xl font-bold text-yellow-600">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Average 401(k) Balance</span>
                      <span className="text-2xl font-bold text-accent-600">$65K</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-900">Retirement Income Gap</span>
                        <span className="text-3xl font-bold text-red-600">70%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Most Americans will need 70-80% of pre-retirement income but traditional 
                        retirement accounts fall far short of this goal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card border-l-4 border-accent-500">
                  <h3 className="font-semibold text-primary-900 mb-3">Why Traditional Retirement Planning Falls Short</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Market Risk:</strong> 401(k)s and IRAs are subject to market volatility</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Tax Risk:</strong> Future tax rates may be higher than today</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Contribution Limits:</strong> IRS limits restrict how much you can save</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Required Distributions:</strong> Forced withdrawals starting at age 73</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Context */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Pennsylvania manufacturing and retirement planning"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">
                  Serving Pennsylvania's Manufacturing Workforce
                </h2>
                <p className="text-lg text-gray-700">
                  With a median age of 43.9 years and a rapidly aging population, Schuylkill County 
                  workers face unique retirement challenges. Traditional pensions are disappearing, 
                  and 401(k) balances aren't keeping pace with retirement needs.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-2xl font-bold text-accent-600 mb-2">43.9</div>
                    <div className="text-sm font-medium text-primary-900">Median Age</div>
                    <div className="text-xs text-gray-500">Above state and national averages</div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-2xl font-bold text-accent-600 mb-2">13%</div>
                    <div className="text-sm font-medium text-primary-900">65+ Growth</div>
                    <div className="text-xs text-gray-500">2010-2022 population increase</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-accent-500">
                  <h3 className="font-semibold text-primary-900 mb-3">The "Silver Tsunami" Challenge</h3>
                  <p className="text-gray-700 text-sm">
                    As the largest generation in history approaches retirement, they're discovering that 
                    traditional retirement accounts may not provide the security they need. Our strategies 
                    focus on principal protection and guaranteed income streams.
                  </p>
                </div>

                <Link href="/consult" className="btn btn-primary">
                  Explore Your Options
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Our Consultation Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We take a comprehensive, education-first approach to retirement planning, 
                ensuring you understand all your options before making any decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Discovery & Analysis</h3>
                <p className="text-gray-700">
                  We analyze your current retirement savings, income needs, and risk tolerance 
                  to identify gaps in your retirement strategy.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Strategy Design</h3>
                <p className="text-gray-700">
                  We design a customized strategy using IUL and FIA products that addresses 
                  your specific needs for growth, protection, and income.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Implementation & Review</h3>
                <p className="text-gray-700">
                  We implement your strategy and provide ongoing reviews to ensure it stays 
                  aligned with your changing needs and market conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary-900 text-white">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Secure Your Retirement Future?
              </h2>
              <p className="text-xl text-gray-200">
                Schedule a comprehensive consultation to explore advanced retirement strategies 
                that provide both growth potential and principal protection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                  Schedule Deep Dive
                </Link>
                <Link href="/book" className="btn btn-outline text-lg px-8 py-4">
                  Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}