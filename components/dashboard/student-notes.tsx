"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, Save, X, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Note } from "@/lib/mock-student-data"

interface StudentNotesProps {
  notes: Note[]
  loading: boolean
}

export function StudentNotes({ notes: initialNotes, loading }: StudentNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    labId: "",
    labTitle: "",
    tags: [],
  })
  const [newNoteTag, setNewNoteTag] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.labTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddTag = () => {
    if (newNoteTag.trim() && !newNote.tags?.includes(newNoteTag.trim())) {
      setNewNote({
        ...newNote,
        tags: [...(newNote.tags || []), newNoteTag.trim()],
      })
      setNewNoteTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags?.filter((t) => t !== tag),
    })
  }

  const handleCreateNote = () => {
    if (newNote.title && newNote.content) {
      const createdNote: Note = {
        id: `note-${Date.now()}`,
        title: newNote.title,
        content: newNote.content,
        date: new Date().toLocaleDateString(),
        labId: newNote.labId || "",
        labTitle: newNote.labTitle || "General Note",
        tags: newNote.tags || [],
      }

      setNotes([createdNote, ...notes])
      setNewNote({
        title: "",
        content: "",
        labId: "",
        labTitle: "",
        tags: [],
      })
      setIsCreating(false)
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
  }

  const handleSaveEdit = () => {
    if (editingNote) {
      setNotes(notes.map((note) => (note.id === editingNote.id ? editingNote : note)))
      setEditingNote(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Study Notes</h2>
        <p className="text-white/70">Manage your personal notes and observations from lab experiments.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search notes..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription className="text-white/70">Add a new study note to your collection.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-white">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Note title"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-white">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your note here..."
                  className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lab" className="text-sm font-medium text-white">
                  Related Lab (Optional)
                </label>
                <Input
                  id="lab"
                  placeholder="Lab title"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newNote.labTitle}
                  onChange={(e) => setNewNote({ ...newNote, labTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium text-white">
                  Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tag"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    value={newNoteTag}
                    onChange={(e) => setNewNoteTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newNote.tags?.map((tag) => (
                    <Badge key={tag} className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 px-2 py-1">
                      {tag}
                      <button className="ml-2 text-indigo-300 hover:text-white" onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateNote}>
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full bg-white/10" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-black/30 backdrop-blur-sm border border-white/10 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-xl">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {note.labTitle && <CardDescription className="text-white/70">From: {note.labTitle}</CardDescription>}
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-white/80 whitespace-pre-wrap">
                    {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-white/50 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {note.date}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No notes found matching your search criteria.</p>
        </div>
      )}

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium text-white">
                  Title
                </label>
                <Input
                  id="edit-title"
                  className="bg-white/5 border-white/10 text-white"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-content" className="text-sm font-medium text-white">
                  Content
                </label>
                <Textarea
                  id="edit-content"
                  className="min-h-[200px] bg-white/5 border-white/10 text-white"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-lab" className="text-sm font-medium text-white">
                  Related Lab
                </label>
                <Input
                  id="edit-lab"
                  className="bg-white/5 border-white/10 text-white"
                  value={editingNote.labTitle}
                  onChange={(e) => setEditingNote({ ...editingNote, labTitle: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => setEditingNote(null)}
            >
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

