'use client';

import { 
  DndContext, 
  DragEndEvent, 
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useTasks, Task } from '@/hooks/useTasks';
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus';
import { useLogout } from '@/hooks/useAuth';
import TaskModal from '@/components/TaskModal';
import KanbanColumn from '@/components/KanbanColumn';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString, parseAsBoolean } from 'nuqs';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

export default function KanbanBoard() {
  const [priority, setPriority] = useQueryState('priority', parseAsString.withDefault(''));
  const [isCreating, setIsCreating] = useQueryState('new', parseAsBoolean);
  const { data: tasks, isLoading } = useTasks({ priority: priority || undefined });
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const logout = useLogout();
  const router = useRouter(); 
  
  const [taskId, setTaskId] = useQueryState('taskId');

  const editingTask = tasks?.find(t => t.id === taskId) || null;
  const isModalOpen = !!taskId || isCreating === true;


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to start drag, allowing click events
      },
    })
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string; // Column ID where dropped

    // Call to NestJS via TanStack Mutation
    updateStatus({ id: taskId, status: newStatus });
  };

  const handleEditTask = (task: Task) => {
    setTaskId(task.id); 
  };

  const handleCreateTask = () => {
    setIsCreating(true); // URL: ?new=true
  };

  const handleCloseModal = () => {
    setTaskId(null);
    setIsCreating(null);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
        <div className="flex gap-4">
          <button
            onClick={handleCreateTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Create Task
          </button>
          <button
            onClick={logout}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
      {/* UI filtre */}
      <div className="flex gap-4 mb-8">
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value || null)}
          className="border p-2 rounded bg-white shadow-sm text-sm"
        >
          <option value="">Wszystkie priorytety</option>
          <option value="HIGH">Wysoki (High)</option>
          <option value="MEDIUM">Średni (Medium)</option>
          <option value="LOW">Niski (Low)</option>
        </select>

        {priority && (
          <button 
            onClick={() => setPriority(null)}
            className="text-xs text-red-500 hover:underline"
          >
            Wyczyść filtry
          </button>
        )}
      </div>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
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
        onClose={handleCloseModal}
        task={editingTask}
      />
    </div>
  );
}