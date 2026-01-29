export interface CommentModel {
  id: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author_name: string;
}

export interface CreateCommentDto {
  taskId: number;
  body: string;
}