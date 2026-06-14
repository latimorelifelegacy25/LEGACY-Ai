import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Group Benefits - Workshops & Education | Latimore Life & Legacy',
  description: 'Educational workshops for schools, municipalities, and small businesses focusing on employee benefits and financial wellness.',
}

export default function GroupPage() {
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
                    <span className="text-sm font-medium">Group Path</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-balance">
                    Group Benefits
                    <br />
                    <span className="text-accent-400">Workshops & Education</span>
                  </h1>
                  <p className="text-xl text-gray-200">
                    Educational workshops for schools, municipalities, and small businesses 
                    focusing on employee benefits and financial wellness programs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                    Request Workshop
                  </Link>
                  <Link href="/book" className="btn btn-outline text-lg px-8 py-4">
                    Schedule Consultation
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                    alt="Group workshop and employee benefits education"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Organizations */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Serving Our Community Organizations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We partner with local institutions to provide comprehensive financial education 
                and benefits consulting tailored to the unique needs of public sector and small business employees.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="card border-l-4 border-blue-500">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-blue-600 rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">School Districts</h3>
                <p className="text-gray-700 mb-6">
                  Comprehensive benefits education for teachers, administrators, and support staff 
                  focusing on retirement planning, supplemental protection, and tax-advantaged savings.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>403(b) and 457(b) plan optimization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Supplemental life and disability coverage</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Summer income replacement strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Early retirement planning workshops</span>
                  </li>
                </ul>
              </div>

              <div className="card border-l-4 border-green-500">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-green-600 rounded-circle"></div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Municipalities</h3>
                <p className="text-gray-700 mb-6">
                  Financial wellness programs for municipal employees, police, fire departments, 
                  and public works staff with focus on pension optimization and family protection.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>PSERS pension maximization strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Deferred compensation plan guidance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>First responder disability protection</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Family income protection planning</span>
                  </li>
                </ul>
              </div>

              <div className="card border-l-4 border-purple-500">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-purple-600 rounded-md"></div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Small Businesses</h3>
                <p className="text-gray-700 mb-6">
                  Employee benefit consulting and financial wellness programs for local businesses 
                  looking to attract and retain talent through comprehensive benefits packages.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Group life and disability coverage</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Key person insurance strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Business succession planning</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Employee financial wellness education</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Workshop Topics */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">
                    Popular Workshop Topics
                  </h2>
                  <p className="text-xl text-gray-600">
                    Our educational workshops are designed to address the most pressing financial 
                    concerns facing employees in the Tri-County region.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-primary-900 mb-3">Retirement Readiness Assessment</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Interactive workshop helping employees calculate their retirement income gap 
                      and explore strategies to bridge it through supplemental savings.
                    </p>
                    <div className="text-xs text-gray-500">Duration: 60 minutes | Format: Interactive presentation</div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-primary-900 mb-3">Living Benefits: Protection While You're Living</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Understanding how modern life insurance provides financial support during 
                      critical illness, chronic conditions, and terminal diagnoses.
                    </p>
                    <div className="text-xs text-gray-500">Duration: 45 minutes | Format: Educational seminar</div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-primary-900 mb-3">Tax-Smart Retirement Strategies</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Exploring tax-advantaged vehicles beyond traditional 401(k)s and IRAs, 
                      including Roth conversions and life insurance retirement plans.
                    </p>
                    <div className="text-xs text-gray-500">Duration: 90 minutes | Format: Workshop with Q&A</div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-primary-900 mb-3">Family Financial Protection Planning</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Comprehensive approach to protecting family income, paying off debts, 
                      and ensuring children's education funding in case of unexpected events.
                    </p>
                    <div className="text-xs text-gray-500">Duration: 75 minutes | Format: Interactive workshop</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
                    alt="Financial education workshop in Pennsylvania"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-6 max-w-xs">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-900 mb-1">500+</div>
                    <div className="text-sm font-medium text-gray-700">Employees Educated</div>
                    <div className="text-xs text-gray-500 mt-1">Across 15+ organizations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Organizations */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Benefits for Your Organization
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Investing in employee financial education creates measurable benefits for both 
                your workforce and your organization's bottom line.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-white rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Reduced Financial Stress</h3>
                <p className="text-sm text-gray-600">
                  Employees with financial education report 23% less workplace stress and improved productivity.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-white rounded-circle"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Improved Retention</h3>
                <p className="text-sm text-gray-600">
                  Organizations offering financial wellness see 36% lower turnover rates among participants.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Enhanced Benefits Utilization</h3>
                <p className="text-sm text-gray-600">
                  Educated employees make better use of existing benefits, maximizing your investment.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-white rounded-lg"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Competitive Advantage</h3>
                <p className="text-sm text-gray-600">
                  Stand out in the talent market by offering comprehensive financial wellness programs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                How We Partner With Your Organization
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our collaborative approach ensures workshops are tailored to your employees' 
                specific needs and delivered at convenient times and locations.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-4">Discovery Call</h3>
                <p className="text-gray-700 text-sm">
                  We discuss your organization's demographics, existing benefits, and employee 
                  financial wellness goals to customize our approach.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-4">Program Design</h3>
                <p className="text-gray-700 text-sm">
                  We create a tailored workshop series addressing your employees' most pressing 
                  financial concerns and career stage needs.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-4">Workshop Delivery</h3>
                <p className="text-gray-700 text-sm">
                  We deliver engaging, educational sessions on-site or virtually, with interactive 
                  elements and practical takeaways for every participant.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-4">Follow-Up Support</h3>
                <p className="text-gray-700 text-sm">
                  We provide individual consultations for interested employees and ongoing 
                  support to help implement the strategies discussed.
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
                Ready to Enhance Your Employee Benefits?
              </h2>
              <p className="text-xl text-gray-200">
                Contact us to discuss how our financial wellness workshops can benefit 
                your organization and improve employee satisfaction and retention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                  Request Workshop Information
                </Link>
                <Link href="/book" className="btn btn-outline text-lg px-8 py-4">
                  Schedule Consultation
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