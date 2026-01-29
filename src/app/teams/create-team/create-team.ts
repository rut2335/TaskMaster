import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Teams } from '../../services/teams-service/teams';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-team.html',
  styleUrl: './create-team.css'
})
export class CreateTeam {
  
  private fb = inject(FormBuilder);
  private teamService = inject(Teams);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  teamForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });

  saveTeam() {
  if (this.teamForm.valid) {
    const name = this.teamForm.get('name')?.value;

    this.teamService.createTeam(name).subscribe({
      next: () => {
        this.teamService.loadTeams(); 
        this.router.navigate(['/teams']);
      },
      error: (err) => console.error(err)
    });
  }
}
}