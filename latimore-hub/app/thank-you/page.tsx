'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const leadSessionId = searchParams.get('lead_session_id') || ''
  const utmParams = searchParams.toString()
  
  const bookingUrl = utmParams ? `/book?${utmParams}` : '/book'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-white rounded-sm relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Thank You for Your Interest!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              We've received your consultation request and will reach out to you shortly 
              to discuss your financial protection needs.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                What Happens Next?
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Review</div>
                    <div className="text-gray-600">We'll review your information and prepare for our conversation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-gray-600">We'll reach out within 24 hours to schedule your consultation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Consult</div>
                    <div className="text-gray-600">We'll have a no-pressure conversation about your needs</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                Prefer to Schedule Now?
              </h3>
              <p className="text-gray-600 mb-6">
                If you'd like to pick a specific time for your consultation, 
                you can book directly using our online calendar.
              </p>
              
              <Link href={bookingUrl} className="btn btn-primary text-lg px-8 py-4">
                Book Your 30-Minute Consultation
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t text-sm text-gray-500">
              <p>
                Jackson M. Latimore Sr., Independent Insurance Consultant<br />
                PA License #1268820 | NIPR #21638507<br />
                Educational content only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  )
}