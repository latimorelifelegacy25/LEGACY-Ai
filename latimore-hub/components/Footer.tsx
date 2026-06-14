'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container">
        {/* Main Footer Content */}
        <div className="section-padding border-b border-primary-800">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-sm relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-xl">Latimore Life & Legacy</div>
                  <div className="text-sm text-gray-300">#TheBeatGoesOn</div>
                </div>
              </Link>

              <p className="text-gray-300 max-w-md">
                Professional insurance and financial protection services for families and businesses 
                in Schuylkill, Luzerne, and Northumberland Counties, Pennsylvania.
              </p>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Jackson M. Latimore Sr.</span>
                </div>
                <div className="text-sm text-gray-300">
                  Independent Insurance Consultant
                </div>
                <div className="text-xs text-gray-400">
                  PA License #1268820 | NIPR #21638507
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Service Areas:</div>
                <div className="text-sm text-gray-300">
                  Schuylkill County • Luzerne County • Northumberland County
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Services</h3>
              <nav className="space-y-3">
                <Link href="/velocity" className="block text-gray-300 hover:text-white transition-colors">
                  Living Benefits
                </Link>
                <Link href="/depth" className="block text-gray-300 hover:text-white transition-colors">
                  Retirement Planning
                </Link>
                <Link href="/group" className="block text-gray-300 hover:text-white transition-colors">
                  Group Benefits
                </Link>
                <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </nav>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Get Started</h3>
              <div className="space-y-3">
                <Link href="/consult" className="block text-accent-400 hover:text-accent-300 transition-colors font-medium">
                  Free Consultation
                </Link>
                <Link href="/book" className="block text-gray-300 hover:text-white transition-colors">
                  Schedule Appointment
                </Link>
                <Link href="tel:+15551234567" className="block text-gray-300 hover:text-white transition-colors">
                  (555) 123-4567
                </Link>
              </div>

              <div className="pt-4 border-t border-primary-800">
                <h4 className="font-medium text-sm mb-2">Legal</h4>
                <nav className="space-y-2">
                  <Link href="/legal/privacy" className="block text-xs text-gray-400 hover:text-gray-300 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/legal/terms" className="block text-xs text-gray-400 hover:text-gray-300 transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/legal/disclosures" className="block text-xs text-gray-400 hover:text-gray-300 transition-colors">
                    Disclosures
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2026 Latimore Life & Legacy LLC. All rights reserved.
            </div>
            
            <div className="text-sm text-gray-400 text-center md:text-right">
              <div>Protecting Today. Securing Tomorrow.</div>
              <div className="text-accent-400 font-medium">#TheBeatGoesOn</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}