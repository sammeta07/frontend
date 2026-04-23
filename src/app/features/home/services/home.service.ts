import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EventType, ProgramType, GroupDetailsModel, StateModel, DistrictModel, CreateSamitiModel, NearbyGroupsRequestBody, ApiResponse } from '../models/home.model';
import { Observable, map } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  groupSearchTerm = signal<string>('');
  groupSelectedDistance = signal<number>(1); // Default distance in kilometers

  getGroupsEventsPrograms(requestBody: NearbyGroupsRequestBody): Observable<GroupDetailsModel[]> {
    return this.http.post<ApiResponse<any[]>>(`${this.baseUrl}/groups`, requestBody).pipe(
      map(response => {
        const groups = Array.isArray(response) ? response : response?.data ?? [];
        return groups.map((g: any) => this.mapGroup(g));
      })
    );
  }

  private mapGroup(g: any): GroupDetailsModel {
    return {
      id: g.id,
      groupId: g.groupId ?? g.group_id ?? '',
      title: g.name ?? g.title ?? '',
      since: g.since,
      description: g.description ?? '',
      area: g.area ?? '',
      locationCords: g.locationCords ?? g.location_cords,
      contactNumbers: g.contactNumbers ?? g.contact_numbers ?? [],
      admins: g.admins ?? [],
      logo: g.logo ?? '',
      favourite: g.favourite ?? false,
      events: (g.events ?? []).map((e: any) => this.mapEvent(e)),
    };
  }

  private mapEvent(e: any): any {
    return {
      id: e.id,
      title: e.title ?? '',
      type: e.type,
      start_date: e.startDate ?? e.start_date ?? '',
      end_date: e.endDate ?? e.end_date ?? '',
      year_count: e.yearCount ?? e.year_count ?? 0,
      description: e.description ?? '',
      locationCords: e.locationCords ?? e.location_cords,
      photos: e.photos ?? [],
      programs: (e.programs ?? []).map((p: any) => this.mapProgram(p)),
    };
  }

  private mapProgram(p: any): any {
    return {
      id: p.id,
      title: p.title ?? '',
      type: p.type,
      date: p.date ?? '',
      from_time: p.fromTime ?? p.from_time ?? '',
      to_time: p.toTime ?? p.to_time ?? '',
      description: p.description ?? '',
      locationCords: p.locationCords ?? p.location_cords,
      photos: p.photos ?? [],
    };
  }

  getStates(): Observable<StateModel[]> {
    return this.http.get<ApiResponse<StateModel[]>>(`${this.baseUrl}/states`).pipe(
      map(response => response.data)
    );
  }

  getDistricts(stateId: number): Observable<DistrictModel[]> {
    return this.http.get<ApiResponse<{ state: any; districts: DistrictModel[] }>>(`${this.baseUrl}/states/${stateId}/districts`).pipe(
      map(response => response.data.districts)
    );
  }

  getAreas(districtId: number): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`api/areas/${districtId}`);
  }

  createSamiti(payload: CreateSamitiModel): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/create-group`, payload).pipe(
      map(response => response.data)
    );
  }
}
