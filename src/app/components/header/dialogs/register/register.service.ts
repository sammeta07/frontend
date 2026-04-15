import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(`${this.baseUrl}/register`, payload);
  }
}
