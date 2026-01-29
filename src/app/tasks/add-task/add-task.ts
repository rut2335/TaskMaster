import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../services/task-service/task';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateTaskDTO } from '../../models/task-model';

@Component({
  selector: 'app-add-task',
  standalone: true, 
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})

export class AddTask implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(Task);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage = '';
  projectId: number = 0;

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    status: ['todo', [Validators.required]],
    priority: ['normal', [Validators.required]],
    assigneeId: [null as number | null],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = Number(id);
      }
    });
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.taskForm.getRawValue();

      const newTask: CreateTaskDTO = {
        projectId: this.projectId,
        title: formValue.title,
        description: formValue.description || '',
        status: formValue.status as any,
        priority: formValue.priority as any,
        assigneeId: formValue.assigneeId || undefined,
        dueDate: formValue.dueDate || undefined,
        orderIndex: 0 
      };

      this.taskService.addTask(newTask).subscribe({
        next: () => {
          this.taskService.loadTasks(this.projectId); 
          this.isLoading = false;
          this.close();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage = 'שגיאה ביצירת המשימה';
        }
      });
    }
  }

  close(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}