'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent-500 rounded-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="font-bold text-primary-900 text-lg">Latimore Life & Legacy</div>
              <div className="text-xs text-gray-600">#TheBeatGoesOn</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/velocity" className="text-gray-700 hover:text-primary-900 transition-colors">
              Living Benefits
            </Link>
            <Link href="/depth" className="text-gray-700 hover:text-primary-900 transition-colors">
              Retirement Planning
            </Link>
            <Link href="/group" className="text-gray-700 hover:text-primary-900 transition-colors">
              Group Benefits
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-900 transition-colors">
              About
            </Link>
            <Link href="/consult" className="btn btn-primary">
              Free Consultation
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              <Link href="/velocity" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Living Benefits
              </Link>
              <Link href="/depth" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Retirement Planning
              </Link>
              <Link href="/group" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Group Benefits
              </Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                About
              </Link>
              <div className="px-4 pt-2">
                <Link href="/consult" className="btn btn-primary w-full">
                  Free Consultation
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}