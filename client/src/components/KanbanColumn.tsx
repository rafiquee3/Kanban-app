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

  return (
    <div ref={setNodeRef} className="bg-gray-100/80 p-4 rounded-xl w-80 min-h-[500px] shadow-inner">
      <h2 className="font-bold mb-4 text-gray-700 uppercase tracking-wide text-sm">{title}</h2>
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
