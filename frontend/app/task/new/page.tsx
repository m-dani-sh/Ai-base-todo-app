"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, Tag, Zap, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface TaskFormData {
  title: string
  description: string
  category: string
  priority: number
  deadline: string
  tags: string[]
}

interface AISuggestions {
  priority: number
  deadline: string
  tags: string[]
  enhancedDescription: string
  reasoning: string
}

export default function NewTaskPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "",
    priority: 3,
    deadline: "",
    tags: [],
  })

  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const categories = ["Work", "Personal", "Health", "Learning", "Finance"]

  const handleAISuggestions = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a task title first")
      return
    }
  
    setIsLoadingAI(true)
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/ai_suggestions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          context: formData.description || "", // or real context if available
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to fetch AI suggestions")
      }
  
      const data = await response.json()
      const suggestions = data.suggestions
  
      setAiSuggestions({
        priority: suggestions.priority,
        deadline: suggestions.deadline,
        tags: suggestions.tags,
        enhancedDescription: suggestions.enhancedDescription,
        reasoning: suggestions.reasoning,
      })
  
    } catch (error) {
      console.error("AI Suggestion Error:", error)
      alert("Failed to get AI suggestions")
    } finally {
      setIsLoadingAI(false)
    }
  }
  

  const applyAISuggestions = () => {
    if (!aiSuggestions) return

    setFormData((prev) => ({
      ...prev,
      priority: aiSuggestions.priority,
      deadline: aiSuggestions.deadline,
      description: aiSuggestions.enhancedDescription,
      tags: [...new Set([...prev.tags, ...aiSuggestions.tags])],
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authentication token if needed:
          // Authorization: `Bearer ${yourAccessToken}`,
        },
        body: JSON.stringify(formData),
      })
  
      if (!res.ok) {
        console.log(res)
        throw new Error("Failed to create task")
      }
  
      const data = await res.json()
      console.log("Task created:", data)
  
      router.push("/dashboard")
    } catch (error) {
      console.error("Error:", error)
      alert("There was an error creating the task.")
    }
  }
  

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
            <p className="text-muted-foreground mt-1">Use AI to enhance your task planning</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Task Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Task Title *</label>
                    <Input
                      placeholder="Enter your task title..."
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your task in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Select
                        value={formData.priority.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, priority: Number.parseInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Low</SelectItem>
                          <SelectItem value="2">2 - Medium Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Deadline</label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1">
                      Create Task
                    </Button>
                    <Link href="/dashboard">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAISuggestions}
                  disabled={isLoadingAI || !formData.title.trim()}
                  className="w-full"
                >
                  {isLoadingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>

                {aiSuggestions && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-2">AI Suggestions</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Priority:</span> {aiSuggestions.priority}/5
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>{" "}
                          {new Date(aiSuggestions.deadline).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {aiSuggestions.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium mb-2">AI Reasoning</h4>
                      <p className="text-sm text-muted-foreground">{aiSuggestions.reasoning}</p>
                    </div>

                    <Button onClick={applyAISuggestions} variant="outline" className="w-full bg-transparent">
                      Apply Suggestions
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-medium mb-2">Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific in your task title</li>
                    <li>• Include context in description</li>
                    <li>• Use tags for better organization</li>
                    <li>• Set realistic deadlines</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
