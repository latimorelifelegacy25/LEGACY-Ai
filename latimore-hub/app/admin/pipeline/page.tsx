'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

const COLUMNS = [
  { id: 'New_Inquiry', title: 'New Inquiry', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'Qualified', title: 'Qualified', color: 'bg-blue-100 border-blue-300' },
  { id: 'Booked', title: 'Booked', color: 'bg-green-100 border-green-300' },
  { id: 'Closed_Won', title: 'Closed Won', color: 'bg-emerald-100 border-emerald-300' },
  { id: 'Closed_Lost', title: 'Closed Lost', color: 'bg-red-100 border-red-300' }
]

interface Contact {
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  county?: string | null
}

interface Inquiry {
  id: string
  interestType: string
  createdAt: string
  status: string
  contact: Contact
  notes?: string
}

export default function PipelinePage() {
  const [data, setData] = useState<Record<string, Inquiry[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  async function loadPipeline() {
    const all: Record<string, Inquiry[]> = {}
    
    for (const col of COLUMNS) {
      try {
        const res = await fetch(`/api/inquiries?status=${encodeURIComponent(col.id)}`, { 
          cache: 'no-store' 
        })
        const { items } = await res.json()
        all[col.id] = items || []
      } catch (error) {
        console.error(`Error loading ${col.id}:`, error)
        all[col.id] = []
      }
    }
    
    setData(all)
    setLoading(false)
  }

  useEffect(() => {
    loadPipeline()
  }, [])

  async function onDragEnd(result: DropResult) {
    const { draggableId, destination, source } = result
    
    if (!destination) return
    
    const from = source.droppableId
    const to = destination.droppableId
    
    if (from === to) return

    // Find the item being moved
    const item = data[from].find(x => x.id === draggableId)
    if (!item) return

    // Optimistic update
    setData(prevData => ({
      ...prevData,
      [from]: prevData[from].filter(x => x.id !== draggableId),
      [to]: [{ ...item, status: to }, ...prevData[to]]
    }))

    // Update on server
    try {
      await fetch(`/api/inquiries/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: to })
      })
    } catch (error) {
      console.error('Error updating inquiry:', error)
      // Revert optimistic update on error
      loadPipeline()
    }
  }

  const getInterestTypeColor = (type: string) => {
    switch (type) {
      case 'Velocity': return 'bg-blue-500'
      case 'Depth': return 'bg-purple-500'
      case 'Group': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Sales Pipeline</h1>
            <p className="text-gray-600">Drag and drop leads to update their status</p>
          </div>
          <button 
            onClick={loadPipeline}
            className="btn btn-outline"
          >
            Refresh
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid lg:grid-cols-5 gap-6">
            {COLUMNS.map(col => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`bg-white rounded-xl shadow-md p-4 min-h-[70vh] ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-primary-900">{col.title}</h2>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {data[col.id]?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(data[col.id] || []).map((inquiry, idx) => (
                        <Draggable draggableId={inquiry.id} index={idx} key={inquiry.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`border-2 rounded-lg p-4 cursor-move transition-shadow ${
                                snapshot.isDragging 
                                  ? 'shadow-lg bg-white border-primary-300' 
                                  : 'bg-white border-gray-200 hover:shadow-md'
                              }`}
                              onClick={() => setSelectedInquiry(inquiry)}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {inquiry.contact.firstName} {inquiry.contact.lastName}
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${getInterestTypeColor(inquiry.interestType)}`}></div>
                                </div>
                                
                                <div className="text-xs text-gray-600">
                                  {inquiry.contact.email}
                                </div>
                                
                                {inquiry.contact.phone && (
                                  <div className="text-xs text-gray-600">
                                    {inquiry.contact.phone}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`px-2 py-1 rounded-full text-white ${getInterestTypeColor(inquiry.interestType)}`}>
                                    {inquiry.interestType}
                                  </span>
                                  <span className="text-gray-500">
                                    {inquiry.contact.county || 'Unknown'}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                  {new Date(inquiry.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">Inquiry Details</h3>
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact</label>
                  <div className="text-gray-900">
                    {selectedInquiry.contact.firstName} {selectedInquiry.contact.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{selectedInquiry.contact.email}</div>
                  {selectedInquiry.contact.phone && (
                    <div className="text-sm text-gray-600">{selectedInquiry.contact.phone}</div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Interest Type</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-white text-sm ${getInterestTypeColor(selectedInquiry.interestType)}`}>
                    {selectedInquiry.interestType}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">County</label>
                  <div className="text-gray-900">{selectedInquiry.contact.county || 'Not specified'}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="text-gray-900">{selectedInquiry.status.replace('_', ' ')}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Received</label>
                  <div className="text-gray-900">{new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                </div>
                
                {selectedInquiry.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <div className="text-gray-900">{selectedInquiry.notes}</div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}