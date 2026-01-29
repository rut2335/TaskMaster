export interface ProjectModel {
    id: number;
    team_id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

export interface CreateProjectDto {
    name: string;
    description: string;
    teamId: number;
}