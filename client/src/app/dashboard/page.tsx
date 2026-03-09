'use client';

import { useTasks } from "@/hooks/useTasks";



export default function DashboardPage() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) return <div className="p-10 text-center">Ładowanie zadań...</div>;
  if (error) return <div className="p-10 text-red-500">Błąd połączenia z API!</div>;

  const columns = [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.value} className="bg-gray-200 p-4 rounded-lg">
            <h2 className="font-bold mb-4 uppercase text-gray-600">{col.label}</h2>
            <div className="space-y-4">
              {tasks?.filter(t => t.status === col.value).map(task => (
                <div key={task.id} className="bg-white p-4 rounded shadow-sm">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}