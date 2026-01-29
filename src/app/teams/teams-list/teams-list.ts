import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Teams } from '../../services/teams-service/teams';
import { TeamData } from '../../models/teams-model';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.css'
})
export class TeamsList implements OnInit {
  protected teamService = inject(Teams);

  errorMessage = '';

  ngOnInit(): void {
    this.teamService.loadTeams();
  }

}