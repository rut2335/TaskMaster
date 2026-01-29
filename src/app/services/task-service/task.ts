import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CreateTaskDTO, TaskModel, UpdateTaskDTO } from '../../models/task-model';
import { API_URL } from '../../core/api.config';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private http = inject(HttpClient);

  tasks = signal<TaskModel[]>([]);

  loadTasks(projectId: number) {
    this.http.get<TaskModel[]>(`${API_URL}/tasks?projectId=${projectId}`)
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
        },
        error: (err) => {
          console.error('שגיאה בטעינת משימות', err);
        }
      });
  }

  addTask(taskData: CreateTaskDTO) {
    return this.http.post(`${API_URL}/tasks`, taskData);
  }

  updateTask(taskId: number, taskData: UpdateTaskDTO) {
    return this.http.patch(`${API_URL}/tasks/${taskId}`, taskData);
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${API_URL}/tasks/${taskId}`);
  }
}