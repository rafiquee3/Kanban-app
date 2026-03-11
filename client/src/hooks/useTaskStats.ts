import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface TaskStats {
  byStatus: Record<string, number>;
  byPriority: { name: string; value: number }[];
}

export const useTaskStats = () => {
  return useQuery({
    queryKey: ['tasks-stats'],
    queryFn: async () => {
      const { data } = await api.get<TaskStats>('/tasks/stats');
      return data;
    },
  });
};