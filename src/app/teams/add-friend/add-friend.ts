import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Teams } from '../../services/teams-service/teams';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-friend.html',
  styleUrl: './add-friend.css'
})
export class AddFriend {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamService = inject(Teams);

  userId = signal<number | null>(null);
  isSubmitting = signal(false);

  addMember(): void {
    const teamId = Number(this.route.snapshot.paramMap.get('teamId') || 
                         this.route.parent?.snapshot.paramMap.get('teamId'));

    if (teamId && this.userId() && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      this.teamService.addMember(teamId, { 
        userId: Number(this.userId()), 
        role: 'member' 
      }).subscribe({
        next: () => {
          this.teamService.loadTeams();
          this.isSubmitting.set(false);
          this.router.navigate(['/teams']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const message = err.status === 403 ? 'אין לך הרשאה לביצוע פעולה זו' : 'הוספת חבר נכשלה';
          alert(message);
        }
      });
    }
  }

  close(): void {
    this.router.navigate(['/teams']);
  }
}