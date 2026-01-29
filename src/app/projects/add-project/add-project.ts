import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../services/project-service/project';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-project',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css',
})

export class AddProject implements OnInit {
  private fb = inject(FormBuilder);
  private projService = inject(Project);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  currentTeamId = 0

  isLoading = false;
  errorMessage = '';

  projectForm = this.fb.nonNullable.group({
    name: ['', { validators: [Validators.required], updateOn: 'blur' }],
    description: ['', { validators: [Validators.required], updateOn: 'blur' }],
    teamId: [0, { validators: [Validators.required], updateOn: 'blur' }],
  });

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('teamId');
      if (id) {
        this.currentTeamId = Number(id);
        this.projectForm.patchValue({ teamId: this.currentTeamId });
      }
    });
  }

  saveProject() {
    if (this.projectForm.valid) {

      const formValue = this.projectForm.getRawValue();
      const projectData = {
        name: formValue.name,
        description: formValue.description,
        teamId: this.currentTeamId
      };

      this.projService.addProject(projectData).subscribe({
        next: () => {
          this.isLoading = false;
          this.projService.loadProjects();
          this.router.navigate(['/teams', this.currentTeamId]);
        },
        error: (err) => {
          console.error(err)
          this.isLoading = false;
          this.errorMessage = 'שגיאה ביצירת פרויקט, נסה שוב מאוחר יותר';
        }
      });
    }
  }
}