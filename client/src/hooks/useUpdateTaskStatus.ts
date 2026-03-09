import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {

      const { data } = await api.patch(`/tasks/${id}`, { status });
      return data;
    },
    // Automatic list refresh on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};