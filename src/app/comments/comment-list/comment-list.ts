import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { commentService } from '../../services/comment-service/comment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList {
  private fb = inject(FormBuilder);
  protected commentService = inject(commentService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskId: number = 0;
  isSending = false;
  currentUserId = 1; 

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('taskId');
      if (id) {
        this.taskId = Number(id);
        this.commentService.loadComments(this.taskId);
      }
    });
  }

sendComment(): void {
  if (this.commentForm.valid) {
    this.isSending = true;

    const newComment = {
      taskId: Number(this.taskId),
      body: this.commentForm.getRawValue().content.trim() 
    };


    this.commentService.addComment(newComment).subscribe({
      next: () => {
        this.isSending = false;
        this.commentForm.reset();
        this.commentService.loadComments(this.taskId);
      },
      error: (err) => {
        this.isSending = false;
        console.error('Server error details:', err.error);
      }
    });
  }
}
  close(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
