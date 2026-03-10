import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from './useTasks';

/**
 * Hook for updating task status with Optimistic Updates.
 * This makes the Kanban board feel instantaneous when dragging cards.
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Endpoint to update only the status
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      return data;
    },
    // 1. onMutate is called BEFORE the actual server request starts
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value (for rollback on error)
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the cache
      // We manually edit the local list so the UI updates immediately
      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        return old?.map((task) =>
          task.id === id ? { ...task, status: status as Task['status'] } : task
        );
      });

      // Return context with the snapshot
      return { previousTasks };
    },
    // 2. If the mutation fails, use the previous snapshot to rollback
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    // 3. Always refetch after error or success to synchronize with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};