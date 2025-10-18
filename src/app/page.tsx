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

      {/* Mobile: vertical stack, Desktop: horizontal layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Notes List */}
        <div className="w-full md:w-80 md:flex-shrink-0 h-1/3 md:h-full overflow-y-auto md:overflow-visible">
          <NotesList
            onSelectNote={handleSelectNote}
            selectedNoteId={selectedNote?.id}
          />
        </div>

        {/* Main Content - Note Editor */}
        <div className="flex-1 overflow-y-auto md:overflow-visible">
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
