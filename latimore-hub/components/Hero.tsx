'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  const [leadSessionId, setLeadSessionId] = useState('')

  useEffect(() => {
    // Generate lead session ID
    const sessionId = crypto.randomUUID()
    setLeadSessionId(sessionId)
    localStorage.setItem('lead_session_id', sessionId)
  }, [])

  return (
    <section className="hero-gradient text-white section-padding">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                Protecting Today.
                <br />
                <span className="text-accent-400">Securing Tomorrow.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200">
                #TheBeatGoesOn
              </p>
              <p className="text-lg text-gray-300 max-w-xl">
                Professional insurance and financial protection services for families and businesses 
                in Schuylkill, Luzerne, and Northumberland Counties, Pennsylvania.
              </p>
            </div>

            {/* Three Pathways */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href="/velocity" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Living Benefits</h3>
                <p className="text-sm text-gray-300">Fast, digital term and living benefits protection</p>
              </Link>

              <Link 
                href="/depth" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Retirement Planning</h3>
                <p className="text-sm text-gray-300">IUL/FIA consultations for wealth accumulation</p>
              </Link>

              <Link 
                href="/group" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 border-2 border-white rounded-md"></div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Group Benefits</h3>
                <p className="text-sm text-gray-300">Workshops for schools and small businesses</p>
              </Link>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consult" className="btn btn-secondary text-lg px-8 py-4">
                Free 30-Minute Consultation
              </Link>
              <Link href="/about" className="btn btn-outline text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
                alt="Pennsylvania family home representing financial security"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-6 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-900">76.3%</div>
                  <div className="text-sm text-gray-600">Homeownership Rate</div>
                  <div className="text-xs text-gray-500">Schuylkill County</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}