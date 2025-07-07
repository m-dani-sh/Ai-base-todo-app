"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  MessageSquare,
  Mail,
  FileText,
  Calendar,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface ContextEntry {
  id: string
  content: string
  source_type: string
  timestamp: string
  tag_names: string[] // ← FIXED FIELD BASED ON BACKEND RESPONSE
}

export default function ContextPage() {
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([])
  const [newContext, setNewContext] = useState("")
  const [selectedSource, setSelectedSource] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newTags, setNewTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const sources = ["Email", "WhatsApp", "Note", "Meeting", "Document", "Other"]

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/contexts/")
        if (!res.ok) throw new Error("Failed to fetch context entries")
        const data = await res.json()
        setContextEntries(data)
      } catch (error) {
        toast.error("Failed to load context entries")
        console.error(error)
      }
    }
    fetchContexts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContext.trim() || !selectedSource) return

    setIsAnalyzing(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contexts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContext,
          source_type: selectedSource,
          tags: newTags,
        }),
      })
      if (!res.ok) throw new Error("Failed to add context")
      const data = await res.json()

      setContextEntries((prev) => [data, ...prev])
      setNewContext("")
      setSelectedSource("")
      setNewTags([])
      setTagInput("")
      toast.success("Context added successfully")
    } catch (error) {
      toast.error("Error adding context")
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/contexts/${id}/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete context")
      setContextEntries((prev) => prev.filter((entry) => entry.id !== id))
      toast.success("Context deleted successfully")
    } catch (error) {
      toast.error("Error deleting context")
      console.error(error)
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const trimmed = tagInput.trim().replace(",", "")
      if (trimmed && !newTags.includes(trimmed)) {
        setNewTags([...newTags, trimmed])
        setTagInput("")
      }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "meeting":
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Context Management</h1>
          <p className="text-muted-foreground mt-1">
            Add context from your daily activities to help AI understand your patterns and priorities
          </p>
        </div>

        {/* Add Context Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Add New Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Context Content *</label>
                <Textarea
                  placeholder="Paste your notes, messages, emails, or any relevant information..."
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Source *</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source.toLowerCase()}>
                        <div className="flex items-center gap-2">
                          {getSourceIcon(source)}
                          {source}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Type a tag and press Enter or comma"
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        setNewTags((prev) => prev.filter((t) => t !== tag))
                      }
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAnalyzing || !newContext.trim() || !selectedSource}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing Context..." : "Add Context"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Context History */}
        <Card>
          <CardHeader>
            <CardTitle>Context History</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your recent context entries with tags
            </p>
          </CardHeader>
          <CardContent>
            {contextEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No context entries yet. Add your first context above!
              </div>
            ) : (
              <div className="space-y-4">
                {contextEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {getSourceIcon(entry.source_type)}
                            <span>{entry.source_type}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm mb-3 leading-relaxed">{entry.content}</p>

                        {Array.isArray(entry.tag_names) && entry.tag_names.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tag_names.map((tag, index) => (
                              <Badge
                                key={`${entry.id}-tag-${index}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
