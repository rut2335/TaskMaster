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

  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/auth/register`, userData);
  }

  login(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/auth/login`, userData).pipe(
      tap(response => {
        this.currentUser.set(response.user); 
        sessionStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
