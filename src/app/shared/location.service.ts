import { Injectable, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { signal } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PermissionInstructionsDialogComponent } from '../components/permission-instructions-dialog/permission-instructions-dialog.component';
import { LocationModel } from '../features/home/models/home.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  
  userLocationCords$ = signal<{ lat: number; long: number } | null>(null);
  userLocationName$ = signal<string>('Fetching location...');

  constructor(private http: HttpClient) {
    this.detectLocation();
  }

  // ************************************************************
  async detectLocation() {
    try {
      // First check what the permission status is
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      if (permissionStatus.state === 'denied') {
        this.dialog.open(PermissionInstructionsDialogComponent, {
          autoFocus: false,
          disableClose: true
        });
        return;
      }
      const pos = await this.getGeolocation();
      this.userLocationCords$.set(pos);
      this.reverseGeocode(pos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (readableLocation: string) => {
            this.userLocationName$.set(readableLocation);
          },
          error: (error) => {
            this.userLocationName$.set('error');
          }
        });

    } catch (error) {
      console.error("Location error:", error);
      this.dialog.open(PermissionInstructionsDialogComponent, {
        width: '700px',
        maxWidth: '90vw',
        autoFocus: false,
        disableClose: false
      });
    }
  }
  getGeolocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({long: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }
  reverseGeocode(coord: LocationModel): Observable<string> {
    const params = {
      format: 'json',
      lat: coord.lat.toString(),
      lon: coord.long.toString(),
      zoom: '10'
    };
    return this.http.get<any>(this.REVERSE_GEOCODING_API, { params }).pipe(
      map(data => {
        // console.log('Reverse geocoding data:', data);
        const address = data.address || {};
        const city = address.state_district || 'Unknown';
        const state = address.state || 'Unknown';
        const result = `${city}`;
        return result;
      }),
      catchError(error => {
        console.error('Error reverse geocoding:', error);
        // return this.getLocationInfo(); // Fallback to IP-based location
        return of('Failed');
      })
    );
  }
  // ************************************************************
  getDistanceFromUser(targetLocation: LocationModel): string | null {
    const userLocationCords = this.userLocationCords$();
    if (!userLocationCords) {
      return 'Calculating...';
    }
    const distance = this.calculateDistance(userLocationCords, targetLocation);
    return this.formatDistance(distance);
  }
  calculateDistance(coord1: LocationModel, coord2: LocationModel): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLon = this.toRadians(coord2.long - coord1.long);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * 
      Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  formatDistance(distanceInKm: number): string {
    if (distanceInKm >= 1) {
      return `${distanceInKm.toFixed(1)} km from you`;
    } else {
      const meters = Math.round(distanceInKm * 1000);
      return `${meters} m from you`;
    }
  }
  // ************************************************************

}
