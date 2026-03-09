'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/hooks/useTasks';

interface DraggableTaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group"
    >
      <p className="font-medium text-gray-800 mb-2">{task.title}</p>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
          task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 
          'bg-green-100 text-green-600'
        }`}>
          {task.priority}
        </span>
        <span className="text-[10px] text-gray-400 group-hover:text-blue-500 transition-colors">Details →</span>
      </div>
    </div>
  );
}
