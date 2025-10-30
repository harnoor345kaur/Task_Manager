import React from 'react'
import { TaskItem } from '../api'
import { Trash2 } from "lucide-react";


type Props = {
    tasks: TaskItem[]
    onToggle: (id: string, isCompleted: boolean) => void
    onDelete: (id: string) => void
}


const TaskList: React.FC<Props> = ({ tasks, onToggle, onDelete }) => {
    if (tasks.length === 0) return <p>No tasks yet.</p>


    return (
    <ul className="task-list">
        {tasks.map((t) => (
            <li key={t.id} className={t.isCompleted ? 'completed' : ''}>
                <label>
                    <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => onToggle(t.id, !t.isCompleted)}
                    />
                    <span className="desc">{t.description}</span>
                </label>
                <button className="delete" onClick={() => onDelete(t.id)}>
                    <Trash2 size={16} />
                </button>
            </li>
        ))}
    </ul>
    )
}


export default TaskList