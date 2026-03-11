import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: string;
  user: {
    email: string;
    username?: string;
  };
}

export const useTasks = (filters?: { status?: string; priority?: string; search?: string }) => {
  return useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const { data } = await api.get('/tasks', { params: filters });
      return data;
    },
  });
};