import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
})


export type TaskItem = {
    id: string
    description: string
    isCompleted: boolean
}


export const getTasks = () => api.get<TaskItem[]>('/tasks')
export const createTask = (payload: { description: string }) => api.post<TaskItem>('/tasks', payload)
export const updateTask = (id: string, payload: Partial<TaskItem>) => api.put(`/tasks/${id}`, payload)
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`)


export default api