import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../services/task-service/task';

@Component({
  selector: 'app-project-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  private route = inject(ActivatedRoute);
  protected taskService = inject(Task);

  projectId = signal<number>(0);

  todoTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'in_progress'));
  doneTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'done'));

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        const idNumber = Number(id);
        this.projectId.set(idNumber);
        this.taskService.loadTasks(idNumber);
      }
    });
  }

  onDragStart(event: DragEvent, taskId: number) {
    event.dataTransfer?.setData('taskId', taskId.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); 
  }

  onDrop(event: DragEvent, newStatus: 'todo' | 'in_progress' | 'done') {
    event.preventDefault();
    const taskId = Number(event.dataTransfer?.getData('taskId'));
    
    if (taskId) {
      this.taskService.updateTask(taskId, { status: newStatus }).subscribe({
        next: () => {
          this.taskService.loadTasks(this.projectId());
        }
      });
    }
  }

  isOverdue(dueDate?: string): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }
}