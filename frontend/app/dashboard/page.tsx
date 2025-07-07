"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Brain } from "lucide-react"
import Link from "next/link"
import { TaskCard } from "@/components/task-card"
import { QuickAddTask } from "@/components/quick-add-task"
// import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  category: string  
  priority: number
  deadline: string
  status: "pending" | "in-progress" | "completed"
  created_at: string
  tags: string[]
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const categories = ["Work", "Personal", "Health", "Learning", "Finance"]
  const priorities = [1, 2, 3, 4, 5]

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tasks/")
        if (!res.ok) throw new Error("Failed to fetch tasks")
        const data = await res.json()
        const formatted = data.map((task: any) => ({
          ...task,
          tags: task.tag_names || [],
          created_at: task.created_at || new Date().toISOString(),
        }))
        setTasks(formatted)
        
        // ✅ Notify user if >= 2 tasks are due today
        const today = new Date().toISOString().split("T")[0]

    // ✅ Filter for tasks due today
    const dueTodayTasks = formatted.filter((task: any) => {
      const taskDate = new Date(task.deadline).toISOString().split("T")[0]
      return (
        taskDate === today &&
        (task.status === "pending" || task.status === "in-progress")
      )
    })

    if (dueTodayTasks.length >= 1) {
      alert(`🔔 You have ${dueTodayTasks.length} tasks due today! Don't forget to complete them.`)
    }

  } catch (error) {
    console.error("Error fetching tasks:", error)
  }
}
  
    fetchTasks()
  }, [])
  console.log("task",tasks)
  const today = new Date().toISOString().split("T")[0]

  console.log("today",today)
  
  useEffect(() => {
    let filtered = tasks
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.priority === Number(priorityFilter),
      )
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }
    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${updatedTask.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
      if (!res.ok) throw new Error("Failed to update task")
      const data = await res.json()
      setTasks((prev) =>
        prev.map((task) =>
          task.id === data.id
            ? {
                ...data,
                tags: data.tag_names || [],
                created_at: data.created_at || task.created_at,
              }
            : task
        )
      )
      // toast.success("Task updated successfully")
    } catch (error) {
      // toast.error("Error updating task")
      console.error("Update Error:", error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete task")
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      // toast.success("Task deleted successfully")
    } catch (error) {
      // toast.error("Error deleting task")
      console.error("Delete Error:", error)
    }
  }

  const handleQuickAdd = async (newTask: Omit<Task, "id" | "created_at">) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
      if (!res.ok) throw new Error("Failed to add task")
      const data = await res.json()
      setTasks((prev) => [
        {
          ...data,
          tags: data.tag_names || [],
          created_at: data.created_at || new Date().toISOString(),
        },
        ...prev,
      ])
      // toast.success("Task added successfully")
      setShowQuickAdd(false)
    } catch (error) {
      // toast.error("Error adding task")
      console.error("QuickAdd Error:", error)
    }
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const pending = tasks.filter((t) => t.status === "pending").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const highPriority = tasks.filter((t) => t.priority >= 4).length
    return { total, completed, pending, inProgress, highPriority }
  }

  const stats = getTaskStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Smart Todo Dashboard</h1>
            <p className="text-muted-foreground mt-1">AI-powered task management</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowQuickAdd(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Quick Add
            </Button>
            <Link href="/task/new">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Brain className="h-4 w-4" /> AI Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(stats).map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p.toString()}>
                        Priority {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {tasks.length === 0
                    ? "No tasks yet. Create your first task!"
                    : "No tasks match your filters."}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            ))
          )}
        </div>

        {/* Quick Add Modal */}
        {showQuickAdd && (
          <QuickAddTask
            onAdd={handleQuickAdd}
            onClose={() => setShowQuickAdd(false)}
            categories={categories}
          />
        )}
      </div>
    </div>
  )
}
