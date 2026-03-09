'use client';

import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useTasks, Task } from '@/hooks/useTasks';
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus';
import TaskModal from '@/components/TaskModal';
import KanbanColumn from '@/components/KanbanColumn';
import { useState } from 'react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

export default function KanbanBoard() {
  const { data: tasks } = useTasks();
  const { mutate: updateStatus } = useUpdateTaskStatus();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string; // Column ID where dropped

    // Call to NestJS via TanStack Mutation
    updateStatus({ id: taskId, status: newStatus });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          Create Task
        </button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              tasks={tasks?.filter(t => t.status === col.id) || []} 
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}