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
import { StatsBar } from '@/components/StatsBar';
import { PriorityChart } from '@/components/PriorityChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, LogOut } from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

import { Suspense } from 'react';

function KanbanBoard() {
  const [priority, setPriority] = useQueryState('priority', parseAsString.withDefault(''));
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 500 })
  );
  const [isCreating, setIsCreating] = useQueryState('new', parseAsBoolean);
  const { data: tasks } = useTasks({ 
    priority: priority || undefined,
    search: search || undefined
  });
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

  const handleCloseModalLocal = () => {
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-slate-900 via-blue-800 to-indigo-900 sm:text-4xl">
          Kanban Board
        </h1>
        <div className="flex gap-4">
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>

          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      {/* UI Filtre/ SEARCH */}
      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value || null)}
          placeholder="Search tasks..."
          className="flex-1 max-w-md"
        />

        <Select value={priority} onValueChange={(val) => setPriority(val === 'all' ? null : val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="HIGH">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>High</span>
              </div>
            </SelectItem>
            <SelectItem value="MEDIUM">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Medium</span>
              </div>
            </SelectItem>
            <SelectItem value="LOW">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Low</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {(priority || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPriority(null);
              setSearch(null);
            }}
            className="text-xs text-red-500 hover:text-red-700 h-9"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* ANALYTICS (STATISTICS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
        <div className="lg:col-span-1">
          <StatsBar />
        </div>
        <div className="lg:col-span-2">
          <PriorityChart />
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
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
        onClose={handleCloseModalLocal}
        task={editingTask}
      />
    </div>
  );
}

export default function KanbanPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <KanbanBoard />
    </Suspense>
  );
}