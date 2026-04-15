import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  status: number;
  data: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    type: string;
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }

  saveUserData(data: LoginResponse['data']): void {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  }

  getUserData(): LoginResponse['data'] | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearUserData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
