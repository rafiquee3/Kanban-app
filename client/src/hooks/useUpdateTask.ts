import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from './useTasks';

/**
 * Hook for general task updates (title, description, etc.) with Optimistic Updates.
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task>) => {
      const { data } = await api.patch(`/tasks/${id}`, updates);
      return data;
    },
    // 1. Snapshot and update local cache BEFORE request completes
    onMutate: async (updatedValues) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the single task in the local list
      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        return old?.map((task) =>
          task.id === updatedValues.id ? { ...task, ...updatedValues } : task
        );
      });

      return { previousTasks };
    },
    // 2. Rollback if error occurs
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    // 3. Sync with server eventually
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
