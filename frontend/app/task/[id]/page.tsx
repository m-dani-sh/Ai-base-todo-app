"use client"

import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
// import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: number
  deadline: string
  status: "pending" | "in-progress" | "completed"
  tags: string[]
  created_at: string
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [tagInput, setTagInput] = useState("")

  const categories = ["Work", "Personal", "Health", "Learning", "Finance"]

  // ✅ Fetch task from API
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`)
        if (!res.ok) throw new Error("Failed to load task")
        const data = await res.json()
        setTask(data)
      } catch (error) {
        console.error(error)
        // toast.error("Error loading task")
      }
    }
    fetchTask()
  }, [id])

  const handleAddTag = () => {
    if (tagInput.trim() && task && !task.tags.includes(tagInput.trim())) {
      setTask((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, tagInput.trim()],
            }
          : null,
      )
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTask((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
          }
        : null,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
      if (!res.ok) throw new Error("Failed to update task")
      // toast.success("Task updated successfully")
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      // toast.error("Error updating task")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete task")
      // toast.success("Task deleted")
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      // toast.error("Error deleting task")
    }
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Task</h1>
              <p className="text-muted-foreground mt-1">Update your task details</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Task
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Task Title *</label>
                <Input
                  placeholder="Enter your task title..."
                  value={task.title}
                  onChange={(e) => setTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your task in detail..."
                  value={task.description}
                  onChange={(e) => setTask((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={task.category}
                    onValueChange={(value) => setTask((prev) => (prev ? { ...prev, category: value } : null))}
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
                    value={task.priority.toString()}
                    onValueChange={(value) =>
                      setTask((prev) => (prev ? { ...prev, priority: Number(value) } : null))
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      setTask((prev) => (prev ? { ...prev, status: value as Task["status"] } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Deadline</label>
                <Input
                  type="date"
                  value={task.deadline}
                  onChange={(e) => setTask((prev) => (prev ? { ...prev, deadline: e.target.value } : null))}
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
                  {task.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
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
    </div>
  )
}
