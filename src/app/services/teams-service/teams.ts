import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { AddMemberDto, TeamData } from '../../models/teams-model';

@Injectable({
  providedIn: 'root',
})
export class Teams {
  private http = inject(HttpClient);

  teams = signal<TeamData[]>([]);

loadTeams() {
    this.http.get<TeamData[]>(`${API_URL}/teams`).subscribe({
      next: (data) => this.teams.set(data),
      error: (err) => console.error('שגיאה בטעינה', err)
    });
  }

  createTeam(teamName: string) {
    return this.http.post(`${API_URL}/teams`, { name: teamName });
  }
  addMember(teamId: number, memberData: AddMemberDto) {
    return this.http.post(`${API_URL}/teams/${teamId}/members`, memberData);
  }
}
