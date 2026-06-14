'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">
                Meet Jackson M. Latimore Sr.
              </h2>
              <p className="text-xl text-gray-600">
                Independent Insurance Consultant serving Pennsylvania's Tri-County Region
              </p>
            </div>

            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                With deep roots in Schuylkill, Luzerne, and Northumberland Counties, Jackson brings 
                a unique understanding of the financial challenges facing our local communities. 
                His approach is built on education first, ensuring every client understands their 
                options before making important financial decisions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary-900">Professional Credentials</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>PA License #1268820</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>NIPR #21638507</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>Independent Consultant</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-primary-900">Service Areas</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>Schuylkill County</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>Luzerne County</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>Northumberland County</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-accent-500">
                <h3 className="font-semibold text-primary-900 mb-3">Our Philosophy</h3>
                <p className="text-gray-700">
                  "True financial security isn't just about having a death benefit. It's about 
                  having protection that works for you while you're living, preserving your 
                  assets and dignity throughout your entire life. That's what living benefits 
                  are all about."
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consult" className="btn btn-primary">
                Schedule Consultation
              </Link>
              <Link href="/about" className="btn btn-outline">
                Learn More About Our Approach
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Professional insurance consultant in Pennsylvania"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
            </div>

            {/* Floating Credential Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-6 max-w-xs">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 border-2 border-accent-500 rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-sm font-medium text-primary-900">Licensed Professional</div>
                <div className="text-xs text-gray-600">PA #1268820</div>
                <div className="text-xs text-gray-500 mt-1">#TheBeatGoesOn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl lg:text-3xl font-bold text-accent-600">10+</div>
            <div className="text-gray-700 font-medium">Years Experience</div>
            <div className="text-sm text-gray-500">Serving Pennsylvania</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl lg:text-3xl font-bold text-accent-600">3</div>
            <div className="text-gray-700 font-medium">Counties Served</div>
            <div className="text-sm text-gray-500">Tri-County Region</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl lg:text-3xl font-bold text-accent-600">100%</div>
            <div className="text-gray-700 font-medium">Independent</div>
            <div className="text-sm text-gray-500">Unbiased Advice</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl lg:text-3xl font-bold text-accent-600">24/7</div>
            <div className="text-gray-700 font-medium">Support</div>
            <div className="text-sm text-gray-500">When You Need Us</div>
          </div>
        </div>
      </div>
    </section>
  )
}