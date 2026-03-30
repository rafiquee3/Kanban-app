import { render, screen, fireEvent } from '@testing-library/react';
import TaskModal from './TaskModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useUpdateTask } from '@/hooks/useUpdateTask';

// Mock mutations
vi.mock('@/hooks/useCreateTask');
vi.mock('@/hooks/useUpdateTask');

describe('TaskModal Component', () => {
  const mockClose = vi.fn();
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateTask as any).mockReturnValue({ mutate: mockCreateMutate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    (useUpdateTask as any).mockReturnValue({ mutate: mockUpdateMutate }); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it('should render empty for new task', () => {
    render(<TaskModal isOpen={true} onClose={mockClose} />);
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task title...')).toHaveValue('');
  });

  it('should render with task data for editing', () => {
    const task = {
      id: '1',
      title: 'Current Task',
      description: 'Some desc',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    };

    render(<TaskModal isOpen={true} onClose={mockClose} task={task as any} />); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Current Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some desc')).toBeInTheDocument();
  });

  it('should call createTask when submitting a new task', () => {
    render(<TaskModal isOpen={true} onClose={mockClose} />);

    fireEvent.change(screen.getByPlaceholderText('Task title...'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Create task'));

    expect(mockCreateMutate).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
    }));
    expect(mockClose).toHaveBeenCalled();
  });

  it('should call updateTask when submitting an existing task', () => {
    const task = {
      id: '1',
      title: 'Old Title',
      status: 'TODO',
      priority: 'MEDIUM',
    };

    render(<TaskModal isOpen={true} onClose={mockClose} task={task as any} />); // eslint-disable-line @typescript-eslint/no-explicit-any

    fireEvent.change(screen.getByDisplayValue('Old Title'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByText('Update task'));

    expect(mockUpdateMutate).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      title: 'Updated Title'
    }));
    expect(mockClose).toHaveBeenCalled();
  });
});
