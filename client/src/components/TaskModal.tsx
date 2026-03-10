'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/hooks/useTasks';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useUpdateTask } from '@/hooks/useUpdateTask';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; // If present, we are in edit mode
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, description, status, priority };

    if (task) {
      updateTask({ id: task.id, ...data });
    } else {
      createTask(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Task title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none h-24"
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
