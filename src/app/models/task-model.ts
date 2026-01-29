export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface TaskModel {
    id: number;
    project_id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee_id?: number;
    due_date?: string;
    order_index: number;
    created_at: string;
}

export interface CreateTaskDTO {
    projectId: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: number;
    dueDate?: string;
    orderIndex?: number;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: number | null;
    dueDate?: string | null;
    order_index?: number;
}
