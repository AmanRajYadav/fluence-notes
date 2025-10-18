'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function NotesList({ onSelectNote, selectedNoteId }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      if (session?.user) {
        fetchNotes(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
      if (session?.user) {
        fetchNotes(session.user.id)
      } else {
        setNotes([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchNotes = async (userId) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      // Remove from local state
      setNotes(notes.filter(note => note.id !== noteId))
      
      // If this was the selected note, clear selection
      if (selectedNoteId === noteId) {
        onSelectNote(null)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleTogglePin = async (noteId, currentPinned) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ pinned: !currentPinned })
        .eq('id', noteId)

      if (error) throw error

      // Update local state
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, pinned: !currentPinned } : note
      ))
    } catch (error) {
      console.error('Error toggling pin:', error)
    }
  }

  if (!user) {
    return (
      <div className="bg-green-50 border-r border-green-200 h-full rounded-r-2xl">
        <div className="p-6 text-center">
          <p className="text-slate-600">
            Please sign in to view your notes
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-green-50 border-r border-green-200 h-full rounded-r-2xl">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-peach-100 h-20 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pinnedNotes = notes.filter(note => note.pinned)
  const unpinnedNotes = notes.filter(note => !note.pinned)

  return (
    <div className="bg-green-50 border-r border-green-200 h-full overflow-y-auto rounded-r-2xl">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-700">
            Notes ({notes.length})
          </h2>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">
              No notes yet. Create your first note!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Pinned
                </h3>
                <div className="space-y-2">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNoteId === note.id}
                      onSelect={() => onSelectNote(note)}
                      onDelete={() => handleDeleteNote(note.id)}
                      onTogglePin={() => handleTogglePin(note.id, note.pinned)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notes */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    All Notes
                  </h3>
                )}
                <div className="space-y-2">
                  {unpinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNoteId === note.id}
                      onSelect={() => onSelectNote(note)}
                      onDelete={() => handleDeleteNote(note.id)}
                      onTogglePin={() => handleTogglePin(note.id, note.pinned)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function NoteCard({ note, isSelected, onSelect, onDelete, onTogglePin }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  // Different colors for public vs private notes
  const bgColor = note.is_public
    ? (isSelected ? 'bg-blue-50' : 'bg-blue-100')
    : (isSelected ? 'bg-white' : 'bg-white')

  const borderColor = note.is_public
    ? (isSelected ? 'border-blue-400' : 'border-blue-300')
    : (isSelected ? 'border-peach-300' : 'border-peach-200')

  const hoverBg = note.is_public ? 'hover:bg-blue-100' : 'hover:bg-peach-50'
  const hoverBorder = note.is_public ? 'hover:border-blue-400' : 'hover:border-peach-300'

  return (
    <div
      className={`p-3 rounded-2xl border cursor-pointer transition-all shadow-sm ${bgColor} ${borderColor} ${hoverBg} ${hoverBorder}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-1">
          <h4 className="font-medium text-black truncate">
            {note.title || 'Untitled'}
          </h4>
          {note.is_public && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              Public
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin()
            }}
            className={`p-1 rounded-full hover:bg-peach-100 transition-colors ${
              note.pinned ? 'text-peach-500' : 'text-slate-400'
            }`}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            📌
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded-full hover:bg-red-100 text-red-400 transition-colors"
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
        {note.content || 'No content'}
      </p>

      <p className="text-xs text-slate-500">
        {formatDate(note.created_at)}
      </p>
    </div>
  )
}
