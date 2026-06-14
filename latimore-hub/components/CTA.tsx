'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CTA() {
  return (
    <section className="section-padding bg-primary-900 text-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Secure Your Family's Future?
              </h2>
              <p className="text-xl text-gray-200">
                Take the first step toward comprehensive financial protection with a free, 
                no-pressure consultation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Free 30-Minute Consultation</h3>
                    <p className="text-sm text-gray-300">No cost, no obligation discussion of your needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Virtual or In-Person</h3>
                    <p className="text-sm text-gray-300">Meet at your convenience, your way</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Local Expertise</h3>
                    <p className="text-sm text-gray-300">Understanding of Tri-County region needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Independent Advice</h3>
                    <p className="text-sm text-gray-300">Unbiased recommendations from multiple carriers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white rounded-sm relative">
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Jackson M. Latimore Sr.</div>
                    <div className="text-sm text-gray-300">Independent Insurance Consultant</div>
                    <div className="text-xs text-gray-400">PA License #1268820 | NIPR #21638507</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  "True financial security isn't just about having a death benefit. It's about 
                  having protection that works for you while you're living, preserving your 
                  assets and dignity throughout your entire life."
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                Schedule Free Consultation
              </Link>
              <Link href="tel:+15551234567" className="btn btn-outline text-lg px-8 py-4">
                Call (555) 123-4567
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                alt="Professional consultation meeting in Pennsylvania"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
            </div>

            {/* Floating Contact Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-6 max-w-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-900 mb-1">Ready to Get Started?</div>
                <div className="text-sm text-gray-600 mb-3">Free consultation available</div>
                <div className="flex items-center justify-center space-x-2 text-accent-600">
                  <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}