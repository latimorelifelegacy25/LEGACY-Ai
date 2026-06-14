'use client'

import { useEffect, useMemo } from 'react'
import { ensureLeadSessionId } from '@/lib/lead'
import { captureUtms } from '@/lib/utm'

export default function ConsultPage() {
  useEffect(() => {
    ensureLeadSessionId()
  }, [])

  const hidden = useMemo(() => ({
    lead_session_id: ensureLeadSessionId(),
    ...captureUtms()
  }), [])

  const params = new URLSearchParams(hidden as any).toString()
  const src = `https://globalfinancialimpact.fillout.com/t/tMz7ZcqpaZus?${params}`

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Request a No-Pressure Consultation
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Take the first step toward comprehensive financial protection with a free, 
              30-minute consultation tailored to your specific needs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">No Cost</h3>
                <p className="text-sm text-gray-600">Completely free consultation with no hidden fees or obligations</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded-circle"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Your Choice</h3>
                <p className="text-sm text-gray-600">Meet virtually via Zoom or in-person at your convenience</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded-md"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Local Expert</h3>
                <p className="text-sm text-gray-600">Understanding of Tri-County region financial challenges</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe 
              src={src} 
              width="100%" 
              height="900" 
              style={{ border: 0 }}
              title="Consultation Request Form"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Jackson M. Latimore Sr., Independent Insurance Consultant<br />
              PA License #1268820 | NIPR #21638507<br />
              Educational content only.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}