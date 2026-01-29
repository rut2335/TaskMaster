import { Component, effect, inject, OnInit } from '@angular/core';
import { Task } from '../../services/task-service/task';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-task',
  imports: [ReactiveFormsModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTask implements OnInit {
private fb = inject(FormBuilder);
  private taskService = inject(Task);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage = '';
  taskId = 0;
  projectId = 0;

  editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    status: ['' as any, [Validators.required]],
    priority: ['' as any, [Validators.required]],
    assignee_id: [null as number | null],
    due_date: ['']
  });

  constructor() {
    effect(() => {
      this.fillForm();
    });
  }

  ngOnInit(): void {
    // 1. שליפת פרמטרים מה-URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('taskId');
      if (id) this.taskId = Number(id);
    });

    this.route.parent?.paramMap.subscribe(params => {
      const pId = params.get('projectId');
      if (pId) {
        this.projectId = Number(pId);
        // אם הרשימה ב-Service ריקה (למשל רענון דף), נטען אותה מחדש
        if (this.taskService.tasks().length === 0) {
          this.taskService.loadTasks(this.projectId);
        }
      }
    });
  }

  fillForm() {
    const taskData = this.taskService.tasks().find(t => t.id === this.taskId);
    if (taskData) {
      this.editForm.patchValue({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignee_id: taskData.assignee_id,
        due_date: taskData.due_date ? taskData.due_date.split('T')[0] : ''
      });
    }
  }

  updateTask() {
    if (this.editForm.valid) {
      this.isLoading = true;
      const updates = this.editForm.getRawValue();
      
      this.taskService.updateTask(this.taskId, updates).subscribe({
        next: () => {
          this.taskService.loadTasks(this.projectId);
          this.close();
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'עדכון המשימה נכשל';
        }
      });
    }
  }

  deleteTask() {
    if (confirm('מחיקה לצמיתות?')) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.taskService.loadTasks(this.projectId);
          this.close();
        }
      });
    }
  }

  close() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
