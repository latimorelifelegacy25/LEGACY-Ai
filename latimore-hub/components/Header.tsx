'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [osMenuOpen, setOsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#2C3E50] rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C49A6C] rounded-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C49A6C] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[#2C3E50] text-lg leading-tight">Latimore Life & Legacy</div>
              <div className="text-xs text-gray-500">#TheBeatGoesOn</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/velocity" className="text-gray-700 hover:text-[#2C3E50] transition-colors text-sm font-medium">
              Living Benefits
            </Link>
            <Link href="/depth" className="text-gray-700 hover:text-[#2C3E50] transition-colors text-sm font-medium">
              Retirement
            </Link>
            <Link href="/group" className="text-gray-700 hover:text-[#2C3E50] transition-colors text-sm font-medium">
              Group
            </Link>

            {/* OS Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOsMenuOpen(!osMenuOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#2C3E50] transition-colors text-sm font-medium"
              >
                OS Tools
                <svg className={`w-4 h-4 transition-transform ${osMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {osMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latimore OS</p>
                  </div>
                  <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Products & Clients</div>
                  {[
                    { href: '/carriers', icon: '🏛️', label: 'Carrier Buildout' },
                    { href: '/products', icon: '📦', label: 'Products Suite' },
                    { href: '/personas', icon: '👥', label: 'Client Personas' },
                    { href: '/business', icon: '🏢', label: 'Business Services' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setOsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2C3E50] transition-colors">
                      <span>{item.icon}</span><span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">OS Tools</div>
                  {[
                    { href: '/playbook', icon: '📖', label: 'OS Master Playbook' },
                    { href: '/campaign', icon: '🏈', label: 'PAHS Campaign Module' },
                    { href: '/calendar', icon: '📅', label: '12-Month Calendar' },
                    { href: '/scripts', icon: '🎯', label: 'Client Presentation Scripts' },
                    { href: '/admin/content-tool', icon: '✍️', label: 'AI Content Generator' },
                    { href: '/admin', icon: '⚙️', label: 'Admin Dashboard' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2C3E50] transition-colors"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/consult"
              className="bg-[#2C3E50] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a2a38] transition-colors"
            >
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
          <div className="md:hidden border-t bg-white pb-4">
            <nav className="py-2 space-y-1">
              {[
                { href: '/velocity', label: 'Living Benefits' },
                { href: '/depth', label: 'Retirement Planning' },
                { href: '/group', label: 'Group Benefits' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Products & Clients</p>
                {[
                  { href: '/carriers', icon: '🏛️', label: 'Carrier Buildout' },
                  { href: '/products', icon: '📦', label: 'Products Suite' },
                  { href: '/personas', icon: '👥', label: 'Client Personas' },
                  { href: '/business', icon: '🏢', label: 'Business Services' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                    <span>{item.icon}</span><span>{item.label}</span>
                  </Link>
                ))}
                <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Latimore OS</p>
                {[
                  { href: '/playbook', icon: '📖', label: 'OS Master Playbook' },
                  { href: '/campaign', icon: '🏈', label: 'PAHS Campaign Module' },
                  { href: '/calendar', icon: '📅', label: '12-Month Calendar' },
                  { href: '/scripts', icon: '🎯', label: 'Client Presentation Scripts' },
                  { href: '/admin/content-tool', icon: '✍️', label: 'AI Content Generator' },
                  { href: '/admin', icon: '⚙️', label: 'Admin Dashboard' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                    <span>{item.icon}</span><span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2">
                <Link href="/consult" className="block w-full bg-[#2C3E50] text-white text-center px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2a38] transition-colors">
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