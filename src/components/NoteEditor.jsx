'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function NoteEditor({ selectedNote, onNoteSaved, onNewNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '')
      setContent(selectedNote.content || '')
      setIsPublic(selectedNote.is_public !== false)
    } else {
      setTitle('')
      setContent('')
      setIsPublic(true)
    }
  }, [selectedNote])

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save notes')
      return
    }

    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content to save the note')
      return
    }

    setLoading(true)
    try {
      if (selectedNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: title.trim() || null,
            content: content.trim() || null,
            is_public: isPublic,
          })
          .eq('id', selectedNote.id)

        if (error) throw error
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: title.trim() || null,
            content: content.trim() || null,
            is_public: isPublic,
          })
          .select()
          .single()

        if (error) throw error
        onNoteSaved(data)
      }

      onNoteSaved(selectedNote)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewNote = () => {
    setTitle('')
    setContent('')
    setIsPublic(true)
    onNewNote()
  }

  const handleDelete = async () => {
    if (!selectedNote) return

    if (!confirm('Are you sure you want to delete this note?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', selectedNote.id)

      if (error) throw error

      onNewNote()
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-white h-full flex items-center justify-center rounded-l-2xl">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Welcome to Fluence Notes
          </h3>
          <p className="text-slate-600">
            Please sign in to start creating and editing notes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white h-full flex flex-col rounded-l-2xl shadow-sm">
      {/* Editor Header */}
      <div className="border-b border-peach-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold bg-transparent border-none outline-none text-black placeholder-gray-500"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleNewNote}
              disabled={loading}
              className="px-4 py-2 bg-green-100 text-slate-700 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50 shadow-sm"
            >
              New Note
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (!title.trim() && !content.trim())}
              className="px-4 py-2 bg-peach-300 text-black rounded-full hover:bg-peach-400 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            {selectedNote && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-200 text-red-700 rounded-full hover:bg-red-300 transition-colors disabled:opacity-50 shadow-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center space-x-3 mt-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-peach-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
            <span className="ml-3 text-sm font-medium text-slate-700">
              {isPublic ? 'Public - Everyone can view' : 'Private - Only you can view'}
            </span>
          </label>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4">
        <textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none bg-transparent border-none outline-none text-black placeholder-gray-500 leading-relaxed"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Editor Footer */}
      <div className="border-t border-peach-200 p-4">
        <div className="flex justify-between items-center text-sm text-slate-500">
          <div>
            {selectedNote ? (
              <span>
                Last saved: {new Date(selectedNote.created_at).toLocaleString()}
              </span>
            ) : (
              <span>New note - changes will be saved automatically</span>
            )}
          </div>
          <div>
            {title.length + content.length} characters
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-slate-400">
          Powered By Fluence
        </div>
      </div>
    </div>
  )
}
