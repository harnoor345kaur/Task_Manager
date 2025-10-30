import React, { useState } from 'react'


type Props = {
    onAdd: (description: string) => void
}


const TaskForm: React.FC<Props> = ({ onAdd }) => {
const [text, setText] = useState('')


const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
}


return (
    <form onSubmit={submit} className="add-task-container">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
        aria-label="Add task"
      />
      <button type="submit">Add</button>
    </form>
)
}

export default TaskForm