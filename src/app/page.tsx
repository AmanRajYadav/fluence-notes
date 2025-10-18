'use client'

import { useState } from 'react'
import Header from '../components/Header'
import NotesList from '../components/NotesList'
import NoteEditor from '../components/NoteEditor'
import { Note } from '../types/note'

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const handleSelectNote = (note: Note | null) => {
    setSelectedNote(note)
  }

  const handleNoteSaved = (note: Note | null) => {
    // This will trigger a re-fetch in NotesList
    setSelectedNote(note)
  }

  const handleNewNote = () => {
    setSelectedNote(null)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-peach-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Notes List */}
        <div className="w-80 flex-shrink-0">
          <NotesList 
            onSelectNote={handleSelectNote}
            selectedNoteId={selectedNote?.id}
          />
        </div>
        
        {/* Main Content - Note Editor */}
        <div className="flex-1">
          <NoteEditor 
            selectedNote={selectedNote}
            onNoteSaved={handleNoteSaved}
            onNewNote={handleNewNote}
          />
        </div>
      </div>
    </div>
  )
}
