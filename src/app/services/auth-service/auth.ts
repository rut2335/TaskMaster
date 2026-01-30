import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../../models/auth-model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private http = inject(HttpClient);
  currentUser = signal<any | null>(null);

  constructor() {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse stored user', e);
        sessionStorage.removeItem('currentUser');
      }
    }
  }

  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/auth/register`, userData).pipe(
      tap(response => {
        this.currentUser.set(response.user);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }

  login(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/auth/login`, userData).pipe(
      tap(response => {
        this.currentUser.set(response.user); 
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    this.currentUser.set(null);
  }
}
