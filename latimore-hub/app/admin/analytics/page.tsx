'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  totalInquiries: number
  conversionRate: number
  topSources: Array<{ source: string; count: number }>
  inquiriesByType: Array<{ type: string; count: number }>
  inquiriesByCounty: Array<{ county: string; count: number }>
  recentTrends: Array<{ date: string; count: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?days=${dateRange}`)
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
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
            <h1 className="text-3xl font-bold text-primary-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Lead attribution and conversion tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button 
              onClick={fetchAnalytics}
              className="btn btn-outline"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">{data.totalInquiries}</div>
                <div className="text-sm text-gray-600">Total Inquiries</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-green-600 rounded-circle"></div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-primary-900">{data.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
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
                  {data.topSources[0]?.count || 0}
                </div>
                <div className="text-sm text-gray-600">Top Source Leads</div>
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
                  {Math.round(data.totalInquiries / parseInt(dateRange) * 7)}
                </div>
                <div className="text-sm text-gray-600">Weekly Average</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inquiry Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-6">Lead Sources</h2>
            <div className="space-y-4">
              {data.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-gray-700">{source.source || 'Direct'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${(source.count / data.totalInquiries) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{source.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interest Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-6">Interest Types</h2>
            <div className="space-y-4">
              {data.inquiriesByType.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      type.type === 'Velocity' ? 'bg-blue-500' :
                      type.type === 'Depth' ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-gray-700">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          type.type === 'Velocity' ? 'bg-blue-500' :
                          type.type === 'Depth' ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${(type.count / data.totalInquiries) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">Geographic Distribution</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.inquiriesByCounty.map((county, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-accent-600 mb-2">{county.count}</div>
                <div className="text-sm font-medium text-primary-900">{county.county || 'Unknown'}</div>
                <div className="text-xs text-gray-500">
                  {((county.count / data.totalInquiries) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">Recent Trends</h2>
          <div className="space-y-3">
            {data.recentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{new Date(trend.date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-primary-500"
                      style={{ 
                        width: `${Math.min((trend.count / Math.max(...data.recentTrends.map(t => t.count))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-6">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attribution Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">Key Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Top Performing Channels</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {data.topSources[0]?.source || 'Direct'} generates the most leads ({data.topSources[0]?.count || 0})</li>
                <li>• {data.inquiriesByType[0]?.type || 'Velocity'} is the most popular interest type</li>
                <li>• {data.inquiriesByCounty[0]?.county || 'Schuylkill'} County has the highest engagement</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Optimization Opportunities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Focus marketing spend on top-performing channels</li>
                <li>• Create more content around popular interest types</li>
                <li>• Consider expanding outreach in underperforming counties</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}