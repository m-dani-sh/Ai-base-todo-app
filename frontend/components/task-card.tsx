"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  PlayCircle,
} from "lucide-react"
import Link from "next/link"

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

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5:
        return "bg-red-500 text-white"
      case 4:
        return "bg-orange-500 text-white"
      case 3:
        return "bg-yellow-500 text-black"
      case 2:
        return "bg-blue-500 text-white"
      case 1:
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in-progress":
        return <PlayCircle className="h-5 w-5 text-blue-600" />
      case "pending":
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }
  

  const isOverdue = () => {
    const today = new Date()
    const deadline = new Date(task.deadline)
    return deadline < today && task.status !== "completed"
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
          tags: task.tags,
          created_at: task.created_at ?? new Date().toISOString(), // ensure tags are included
        }),
      })

      if (!res.ok) throw new Error("Failed to update task")
      const updated = await res.json()
      onUpdate(updated)
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete task")
      onDelete(task.id)
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${task.status === "completed" ? "opacity-75" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => {
                const nextStatus =
                  task.status === "completed"
                    ? "pending"
                    : task.status === "pending"
                    ? "in-progress"
                    : "completed"
                handleStatusChange(nextStatus)
              }}
              className="mt-1 hover:scale-110 transition-transform"
            >
              {getStatusIcon(task.status)}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3
                  className={`font-semibold text-lg ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </h3>
                <Badge className={getPriorityColor(task.priority)}>P{task.priority}</Badge>
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status.replace("-", " ")}
                </Badge>
              </div>

              <p
                className={`text-muted-foreground mb-3 ${task.status === "completed" ? "line-through" : ""} ${!isExpanded ? "line-clamp-2" : ""}`}
              >
                {task.description}
              </p>

              {task.description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-3"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{task.category}</span>
                </div>
                <div className={`flex items-center gap-1 ${isOverdue() ? "text-red-600" : ""}`}>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(task.deadline)}</span>
                  {isOverdue() && <span className="text-red-600 font-medium">(Overdue)</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDate(task.created_at)}</span>
                </div>
              </div>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Link href={`/task/${task.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
