import { Component, inject, OnInit, signal, computed } from '@angular/core'; 
import { DatePipe } from '@angular/common';
import { Project } from '../../services/project-service/project';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DatePipe, RouterOutlet, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  protected projService = inject(Project);
  private route = inject(ActivatedRoute); 

  currentTeamId = signal<number>(0);

  teamProjects = computed(() => {
    const allProjects = this.projService.projects();
    const teamId = this.currentTeamId();
    return allProjects.filter(p => p.team_id === teamId);
  });

  ngOnInit(): void {
    this.projService.loadProjects();

    this.route.paramMap.subscribe(params => {
      const id = params.get('teamId');
      if (id) {
        this.currentTeamId.set(Number(id));
      }
    });
  }
}