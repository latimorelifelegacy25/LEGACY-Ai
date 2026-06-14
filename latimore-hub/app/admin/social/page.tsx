'use client'

import { useState, useEffect } from 'react'
import { SocialContentGenerator, defaultSocialConfig, SocialPost } from '@/lib/social-workflow'

export default function SocialWorkflowPage() {
  const [generator] = useState(new SocialContentGenerator(defaultSocialConfig))
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [targetAudience, setTargetAudience] = useState('Young families in Schuylkill County')
  const [weekStart, setWeekStart] = useState('2026-02-17')
  const [loading, setLoading] = useState(false)

  const generateWeeklyContent = async () => {
    setLoading(true)
    try {
      const weeklyPosts = generator.generateWeeklyBatch(targetAudience, weekStart)
      setPosts(weeklyPosts)
      
      // Save to database
      await fetch('/api/social-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posts: weeklyPosts,
          audience: targetAudience,
          weekStart
        })
      })
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateVideoScript = () => {
    const script = generator.generateVideoScript(
      'Living Benefits Protection',
      targetAudience
    )
    
    console.log('Video Script Generated:', script)
    // You could save this to state or database as needed
  }

  const generateCanvaBrief = () => {
    const brief = generator.generateCanvaBrief(
      'Static Post',
      'Protecting Today. Securing Tomorrow.'
    )
    
    console.log('Canva Brief Generated:', brief)
    // You could save this to state or database as needed
  }

  return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-900">AI Social Content Workflow</h1>
        <div className="text-sm text-gray-500">
          {defaultSocialConfig.brandName} • {defaultSocialConfig.brandTagline}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Content Generation Settings</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Young families in Schuylkill County">Young families in Schuylkill County</option>
              <option value="Pre-retirees approaching retirement">Pre-retirees approaching retirement</option>
              <option value="Small business owners">Small business owners</option>
              <option value="School district employees">School district employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Start Date
            </label>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={generateWeeklyContent}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Weekly Content Batch'}
          </button>
          
          <button
            onClick={generateVideoScript}
            className="btn btn-secondary"
          >
            Generate Video Script
          </button>
          
          <button
            onClick={generateCanvaBrief}
            className="btn btn-outline"
          >
            Generate Canva Brief
          </button>
        </div>
      </div>

      {/* Generated Content Display */}
      {posts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">Generated Weekly Content</h2>
          
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.day}
                    </div>
                    <div className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                      {post.pillar}
                    </div>
                    <div className="text-sm text-gray-600">
                      {post.platform}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    CTA: {post.ctaType}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Audience: {post.audienceSegment}
                  </div>
                  <div className="whitespace-pre-wrap text-gray-800">
                    {post.postCopy}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="text-sm text-primary-600 hover:text-primary-800">
                    Edit
                  </button>
                  <button className="text-sm text-accent-600 hover:text-accent-800">
                    Schedule
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Configuration Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Brand Configuration</h2>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Brand Identity</h3>
            <div className="space-y-1 text-gray-600">
              <div><strong>Name:</strong> {defaultSocialConfig.brandName}</div>
              <div><strong>Message:</strong> {defaultSocialConfig.coreMessage}</div>
              <div><strong>Tagline:</strong> {defaultSocialConfig.brandTagline}</div>
              <div><strong>Tone:</strong> {defaultSocialConfig.brandToneSummary}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Market Focus</h3>
            <div className="space-y-1 text-gray-600">
              <div><strong>Regions:</strong> {defaultSocialConfig.serviceRegions}</div>
              <div><strong>Local Markets:</strong> {defaultSocialConfig.localMarketsFocus}</div>
              <div><strong>Platforms:</strong> {defaultSocialConfig.primaryPlatforms}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Compliance Footer</h4>
          <div className="text-xs text-gray-600">
            {defaultSocialConfig.complianceFooter}
          </div>
        </div>
      </div>
    </main>
  )
}