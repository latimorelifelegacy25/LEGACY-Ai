'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  county?: string
  createdAt: string
}

interface Inquiry {
  id: string
  interestType: string
  status: string
  createdAt: string
  contact: Contact
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries?status=New_Inquiry')
      const data = await response.json()
      setInquiries(data.items || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">LatimoreHub Admin</h1>
            <p className="text-gray-600">Comprehensive CRM and Content Management System</p>
          </div>
          <div className="text-sm text-gray-500">
            Latimore Life & Legacy LLC • #TheBeatGoesOn
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">{inquiries.length}</div>
                <div className="text-sm text-gray-600">New Inquiries</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-green-600 rounded-circle"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">
                  {inquiries.filter(i => i.interestType === 'Velocity').length}
                </div>
                <div className="text-sm text-gray-600">Velocity Leads</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-purple-600 rounded-md"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">
                  {inquiries.filter(i => i.interestType === 'Depth').length}
                </div>
                <div className="text-sm text-gray-600">Depth Leads</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent-600 rounded-lg"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">
                  {inquiries.filter(i => i.interestType === 'Group').length}
                </div>
                <div className="text-sm text-gray-600">Group Leads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/pipeline" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-sm relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Pipeline Management</h3>
                <p className="text-sm text-gray-600">Drag-and-drop Kanban board for lead management</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/social" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-circle"></div>
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Social Content Workflow</h3>
                <p className="text-sm text-gray-600">AI-powered social media content generation</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-md"></div>
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Lead attribution and conversion tracking</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">Recent Inquiries</h2>
              <Link href="/admin/pipeline" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    County
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.slice(0, 10).map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {inquiry.contact.firstName} {inquiry.contact.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{inquiry.contact.email}</div>
                        {inquiry.contact.phone && (
                          <div className="text-sm text-gray-500">{inquiry.contact.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        inquiry.interestType === 'Velocity' ? 'bg-blue-100 text-blue-800' :
                        inquiry.interestType === 'Depth' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.interestType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.contact.county || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {inquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {inquiries.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-gray-400 rounded-sm"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-500">New leads will appear here when they submit the consultation form.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}