import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.yourdomain.com/api'; // Replace with your actual API URL

  constructor() { }

  // Example GET method to fetch data
  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/home-data`);
  }

  // Example POST method to submit data to the server
  submitData(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, payload);
  }

  // Fetch events for a specific year (Example using HttpParams if needed)
  getEventsByYear(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${year}`);
  }
}
