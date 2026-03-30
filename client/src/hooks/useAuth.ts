import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: Record<string, unknown>) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      }
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const { data } = await api.post('/auth/register', userData);
      return data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return logout;
};
