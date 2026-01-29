import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { AuthResponse, User } from '../../models/auth-model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private http = inject(HttpClient);
currentUser = signal<any | null>(null);

  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, userData);
  }

  login(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, userData).pipe(
      tap(response => {
        this.currentUser.set(response.user); 
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
