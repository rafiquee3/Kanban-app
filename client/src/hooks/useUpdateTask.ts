import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from './useTasks';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task>) => {
      const { data } = await api.patch(`/tasks/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
