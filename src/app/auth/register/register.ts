import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth';
import { User } from '../../models/auth-model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMessage: string | null = null;

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as User).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/teams']); 
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.errorMessage = err.error?.message || 'שגיאה בהרשמה נסה שוב מאוחר יותר';
        }
      });
    }
  }
}