'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function BookingContent() {
  const searchParams = useSearchParams()
  const leadSessionId = searchParams.get('lead_session_id') || ''
  const utmParams = searchParams.toString()
  
  // Google Calendar Appointment URL with parameters
  const baseUrl = "https://calendar.google.com/calendar/appointments/AcZssZ0pWKOYTgg4xc8vleuqTnfpTwqm8oYaG2B5TxA=?gv=true"
  const calendarUrl = utmParams ? `${baseUrl}&${utmParams}` : baseUrl

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Book Your Free Consultation
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Choose a convenient time for your 30-minute consultation with Jackson M. Latimore Sr.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Virtual Meeting</h3>
                <p className="text-sm text-gray-600">Secure Zoom consultation from the comfort of your home</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded-circle"></div>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">In-Person Meeting</h3>
                <p className="text-sm text-gray-600">Face-to-face consultation in the Tri-County region</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe 
              src={calendarUrl}
              width="100%" 
              height="800" 
              style={{ border: 0 }}
              title="Book Consultation"
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

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}