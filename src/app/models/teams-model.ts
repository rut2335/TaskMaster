export interface TeamData {
  id: number;
  name: string;
  created_at: string;
  members_count: number;
}
export interface AddMemberDto {
  userId: number;
  role: 'member' | 'admin';
}