'use client';

import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/hooks/useTasks';
import { useDeleteTask } from '@/hooks/useDeleteTask';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DraggableTaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      }
    } catch (e) {
      // Ignore token parse error
    }
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the edit modal
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      deleteTask(task.id);
    }
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      if (parts[0]) return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group flex gap-3"
    >
      <div className="flex-shrink-0 mt-0.5">
        <Avatar className="h-8 w-8 border border-white shadow-sm ring-1 ring-slate-100">
          <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
            {getInitials(task.user?.username, task.user?.email)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <p className="font-medium text-gray-800 truncate pr-2">{task.title}</p>
          {task.userId === currentUserId && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`text-gray-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 -mt-1 -mr-1 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mb-3 truncate">
          by {task.user?.username || task.user?.email}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 
            'bg-green-100 text-green-600'
          }`}>
            {task.priority}
          </span>
          <span className="text-[10px] text-gray-400 group-hover:text-blue-500 transition-colors ml-2">Details →</span>
        </div>
      </div>
    </div>
  );
}
