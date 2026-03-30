import { renderHook, act } from '@testing-library/react';
import { useLogout } from './useAuth';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('useAuth Hooks', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush }); // eslint-disable-line @typescript-eslint/no-explicit-any
    
    // Clear localStorage
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'removeItem');
  });

  describe('useLogout', () => {
    it('should remove token from localStorage and redirect to login', () => {
      localStorage.setItem('token', 'fake-token');
      
      const { result } = renderHook(() => useLogout());
      
      act(() => {
        result.current();
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
