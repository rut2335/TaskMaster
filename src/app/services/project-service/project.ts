import { inject, Injectable, signal } from '@angular/core';
import { CreateProjectDto, ProjectModel } from '../../models/project-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class Project {

  private http = inject(HttpClient);
  projects = signal<ProjectModel[]>([]);

  loadProjects() {
    this.http.get<ProjectModel[]>(`${environment.API_URL}/projects`).subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (err) => {
        console.error('שגיאה בטעינת פרויקטים', err);
      }
    })
  }

  addProject(projectData: CreateProjectDto) {
    return this.http.post(`${environment.API_URL}/projects`, projectData);
  }
  
}
