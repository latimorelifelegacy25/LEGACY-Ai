'use client'

import Link from 'next/link'
import Image from 'next/image'

const services = [
  {
    id: 'velocity',
    title: 'Living Benefits',
    subtitle: 'Fast, Digital Protection',
    description: 'Term life insurance with living benefits that provide financial support during health crises, preserving assets and dignity throughout your entire life.',
    features: [
      'Accelerated death benefits for critical illness',
      'Digital application process',
      'Competitive rates for healthy applicants',
      'Coverage up to $1M without medical exam'
    ],
    icon: '⚡',
    color: 'bg-blue-50 border-blue-200',
    href: '/velocity'
  },
  {
    id: 'depth',
    title: 'Retirement Planning',
    subtitle: 'IUL/FIA Consultations',
    description: 'Tax-advantaged wealth accumulation strategies using indexed universal life insurance and fixed index annuities for secure retirement income.',
    features: [
      'Tax-free retirement income strategies',
      'Principal protection from market loss',
      'Guaranteed lifetime income options',
      'Asset protection from creditors'
    ],
    icon: '🏛️',
    color: 'bg-green-50 border-green-200',
    href: '/depth'
  },
  {
    id: 'group',
    title: 'Group Benefits',
    subtitle: 'Workshops & Education',
    description: 'Educational workshops for schools, municipalities, and small businesses focusing on employee benefits and financial wellness.',
    features: [
      'On-site financial wellness workshops',
      'Group life and disability coverage',
      'Retirement plan consulting',
      'Employee education programs'
    ],
    icon: '👥',
    color: 'bg-purple-50 border-purple-200',
    href: '/group'
  }
]

export default function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
            Three Pathways to Financial Security
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you need fast protection, comprehensive planning, or group solutions, 
            we have the expertise to guide you toward financial peace of mind.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className={`card border-2 ${service.color} hover:shadow-lg transition-shadow`}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">{service.title}</h3>
                <p className="text-accent-600 font-medium">{service.subtitle}</p>
              </div>

              <p className="text-gray-700 mb-6">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={service.href} className="btn btn-primary w-full">
                Learn More
              </Link>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-primary-900 mb-4">
              Serving Pennsylvania's Tri-County Region
            </h3>
            <p className="text-gray-600">
              Understanding the unique financial challenges facing our local communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent-600 mb-2">76.3%</div>
              <div className="text-gray-700 font-medium">Homeownership Rate</div>
              <div className="text-sm text-gray-500">Schuylkill County</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent-600 mb-2">43.9</div>
              <div className="text-gray-700 font-medium">Median Age</div>
              <div className="text-sm text-gray-500">Above state average</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent-600 mb-2">13%</div>
              <div className="text-gray-700 font-medium">65+ Growth</div>
              <div className="text-sm text-gray-500">2010-2022</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}