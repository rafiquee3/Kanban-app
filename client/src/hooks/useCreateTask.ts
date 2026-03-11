import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from './useTasks';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const { data } = await api.post('/tasks', task);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-stats'] });
    },
  });
};
