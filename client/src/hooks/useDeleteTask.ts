import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from './useTasks';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/tasks/${id}`);
      return data;
    },
    // Optimistic update
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        return old?.filter((task) => task.id !== deletedId);
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-stats'] });
    },
  });
};
