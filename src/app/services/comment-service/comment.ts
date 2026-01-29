import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CommentModel, CreateCommentDto } from '../../models/comment-model';
import { API_URL } from '../../core/api.config';

@Injectable({
  providedIn: 'root',
})
export class commentService {
  private http = inject(HttpClient);

  comments = signal<CommentModel[]>([]);

  loadComments(taskId: number) {
    this.http.get<CommentModel[]>(`${API_URL}/comments?taskId=${taskId}`)
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
        error: (err) => {
          console.error('Error loading comments', err);
        }
      });
  }

  addComment(commentData: CreateCommentDto) {
    return this.http.post(`${API_URL}/comments`, commentData);
  }

}
