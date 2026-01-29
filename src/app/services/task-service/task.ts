import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CreateTaskDTO, TaskModel, UpdateTaskDTO } from '../../models/task-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private http = inject(HttpClient);

  tasks = signal<TaskModel[]>([]);

  loadTasks(projectId: number) {
    this.http.get<TaskModel[]>(`${environment.API_URL}/tasks?projectId=${projectId}`)
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
    return this.http.post(`${environment.API_URL}/tasks`, taskData);
  }

  updateTask(taskId: number, taskData: UpdateTaskDTO) {
    return this.http.patch(`${environment.API_URL}/tasks/${taskId}`, taskData);
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${environment.API_URL}/tasks/${taskId}`);
  }
}