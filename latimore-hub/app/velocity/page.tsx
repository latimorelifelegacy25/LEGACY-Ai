import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Living Benefits - Fast Digital Protection | Latimore Life & Legacy',
  description: 'Term life insurance with living benefits that provide financial support during health crises, preserving assets and dignity throughout your entire life.',
}

export default function VelocityPage() {
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
                    <span className="text-sm font-medium">Velocity Path</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-balance">
                    Living Benefits
                    <br />
                    <span className="text-accent-400">Fast Digital Protection</span>
                  </h1>
                  <p className="text-xl text-gray-200">
                    Term life insurance with living benefits that provide financial support during health crises, 
                    preserving assets and dignity throughout your entire life.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                    Get Your Quote
                  </Link>
                  <Link href="/book" className="btn btn-outline text-lg px-8 py-4">
                    Schedule Consultation
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Family protection and financial security"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Protection That Works While You're Living
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                True financial security isn't just about having a death benefit. It's about having protection 
                that works for you while you're living, preserving your assets and dignity throughout your entire life.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="card">
                <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-white rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Accelerated Death Benefits</h3>
                <p className="text-gray-700 mb-6">
                  Access up to 100% of your death benefit while living if diagnosed with a qualifying critical, 
                  chronic, or terminal illness. Use funds for medical bills, mortgage payments, or any need.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Heart attack, stroke, cancer coverage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Chronic illness benefits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Terminal illness acceleration</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-white rounded-circle"></div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Digital Application Process</h3>
                <p className="text-gray-700 mb-6">
                  Fast, streamlined application process with competitive rates for healthy applicants. 
                  Coverage up to $1M without a medical exam for qualified candidates.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Online application in minutes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>No medical exam up to $1M</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Quick approval process</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">Affordable Protection</h3>
                <p className="text-gray-700 mb-6">
                  Term life insurance provides maximum coverage at the lowest cost, perfect for young families 
                  and those with temporary needs like mortgage protection.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Level premiums for 10-30 years</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Conversion options available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Competitive rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Local Context */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">
                  Protecting Schuylkill County Families
                </h2>
                <p className="text-lg text-gray-700">
                  With a heart disease death rate nearly double the state average, families in our region 
                  face unique health challenges. Living benefits ensure you have financial support when 
                  you need it most.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-2xl font-bold text-accent-600 mb-2">76.3%</div>
                    <div className="text-sm font-medium text-primary-900">Homeownership Rate</div>
                    <div className="text-xs text-gray-500">Protect your family's most valuable asset</div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-2xl font-bold text-accent-600 mb-2">178</div>
                    <div className="text-sm font-medium text-primary-900">Heart Disease Deaths</div>
                    <div className="text-xs text-gray-500">Per 100,000 residents annually</div>
                  </div>
                </div>

                <Link href="/consult" className="btn btn-primary">
                  Get Your Free Quote
                </Link>
              </div>

              <div className="relative">
                <div className="relative w-full h-96 lg:h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
                    alt="Pennsylvania family home"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary-900 text-white">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Protect Your Family's Future?
              </h2>
              <p className="text-xl text-gray-200">
                Get a personalized quote in minutes or schedule a free consultation to discuss 
                your family's specific protection needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                  Get Free Quote
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