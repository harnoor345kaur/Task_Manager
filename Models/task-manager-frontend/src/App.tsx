import React, { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { getTasks, createTask, updateTask, deleteTask, TaskItem } from './api'


const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load tasks from API')
    } finally {
    setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (description: string) => {
    try {
      const res = await createTask({ description })
      setTasks((s) => [...s, res.data])
    } catch (err) {
      console.error(err)
      alert('Failed to add task')
    }
  }

  const toggleTask = async (id: string, isCompleted: boolean) => {
    try {
      await updateTask(id, { isCompleted })
      setTasks((s) => s.map(t => t.id === id ? { ...t, isCompleted } : t))
    } catch (err) {
      console.error(err)
      alert('Failed to update task')
    }
  }

  const removeTask = async (id: string) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      setTasks((s) => s.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete task')
    }
  }


  const filtered = tasks.filter(t =>
  filter === 'all' ? true : filter === 'active' ? !t.isCompleted : t.isCompleted
  )

  return (
  <div className="container">
    <h1>Basic Task Manager</h1>


    <TaskForm onAdd={addTask} />


    <div className="filters">
      <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
      <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
      <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
    </div>


    {loading ? <p>Loading...</p> : <TaskList tasks={filtered} onToggle={toggleTask} onDelete={removeTask} />}


    <footer>
      <small>Tasks saved on server memory (in-memory). Refreshing the backend will reset data.</small>
    </footer>
  </div>
  )
}
export default App