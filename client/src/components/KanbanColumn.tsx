'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task } from '@/hooks/useTasks';
import DraggableTaskCard from './DraggableTaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export default function KanbanColumn({ id, title, tasks, onEditTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case 'TODO': return 'border-slate-500';
      case 'IN_PROGRESS': return 'border-blue-500';
      case 'DONE': return 'border-emerald-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      className={`bg-gray-100/80 p-4 rounded-xl flex-1 w-full min-w-[280px] min-h-[500px] shadow-inner border-t-4 ${getStatusColor(id)}`}
    >
      <h2 className="font-bold mb-4 text-gray-700 uppercase tracking-wide text-sm flex items-center gap-2">
        {title}
        <span className="bg-gray-300/50 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
          {tasks.length}
        </span>
      </h2>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <DraggableTaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onEditTask(task)} 
          />
        ))}
      </div>
    </div>
  );
}
