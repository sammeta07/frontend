import { Injectable, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PermissionInstructionsDialogComponent } from './components/permission-instructions-dialog/permission-instructions-dialog.component';
import { LocationModel } from './features/home/models/home.model';

// export interface IpLocationData {
//   ip: string;
//   city: string;
//   region: string;
//   country: string;
//   latitude: number;
//   longitude: number;
//   postal: string;
//   timezone: string;
// }

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly IP_LOCATION_API_URL = 'https://ipapi.co/json/';
  private readonly REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';
  private dialog = inject(MatDialog);
  location$ = new BehaviorSubject<{ lat: number; long: number } | null>(null);
  locationName$ = new BehaviorSubject<string>('Fetching location...');
  private destroyRef = inject(DestroyRef);
  

  constructor(private http: HttpClient) {
    this.detectLocation();
  }

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

      // If not denied, this line will trigger browser's default permission popup
      const pos = await this.getGeolocation();
      console.log('pos',pos);
      this.location$.next(pos);
      
      // Convert coordinates to readable location name
      this.reverseGeocode(pos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (readableLocation: string) => {
            this.locationName$.next(readableLocation);
          },
          error: (error) => {
            this.locationName$.next('error');
          }
        });

    } catch (error) {
      console.error("Location error:", error);
      // Show instructions dialog on error
      this.dialog.open(PermissionInstructionsDialogComponent, {
        width: '700px',
        maxWidth: '90vw',
        autoFocus: false,
        disableClose: false
      });
    }
  }

  /**
  * Browser se coordinates lene ka promise function
  */
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

  /**
  * Convert coordinates to readable location name using reverse geocoding
  */
  reverseGeocode(coord: LocationModel): Observable<string> {
    const params = {
      format: 'json',
      lat: coord.lat.toString(),
      lon: coord.long.toString(),
      zoom: '10'
    };
    return this.http.get<any>(this.REVERSE_GEOCODING_API, { params }).pipe(
      map(data => {
        const address = data.address || {};
        const city = address.state_district || 'Unknown';
        const state = address.state || 'Unknown';
        const result = `${city}, ${state}`;
        return result;
      }),
      catchError(error => {
        console.error('Error reverse geocoding:', error);
        // return this.getLocationInfo(); // Fallback to IP-based location
        return of('Unknown Location');
      })
    );
  }

  /**
   * Get location from IP address using ipapi.co free API
   * Returns location coordinates (lat, long)
   */
  // getIpLocation(): Observable<LocationCoordinates> {
  //   return this.http.get<IpLocationData>(this.IP_LOCATION_API_URL).pipe(
  //     map(data => ({
  //       lat: data.latitude,
  //       long: data.longitude
  //     })),
  //     catchError(error => {
  //       console.error('Error fetching IP location:', error);
  //       // Fallback to default coordinates (India center)
  //       return of({ lat: 20.5937, long: 78.9629 });
  //     })
  //   );
  // }

  /**
   * Get full IP location details
   */
  // getIpLocationDetails(): Observable<IpLocationData> {
  //   return this.http.get<IpLocationData>(this.IP_LOCATION_API_URL).pipe(
  //     catchError(error => {
  //       console.error('Error fetching IP location details:', error);
  //       // Return default country data
  //       return of({
  //         ip: 'unknown',
  //         city: 'Unknown',
  //         region: 'Unknown',
  //         country: 'India',
  //         latitude: 20.5937,
  //         longitude: 78.9629,
  //         postal: 'Unknown',
  //         timezone: 'UTC'
  //       });
  //     })
  //   );
  // }

  /**
   * Format coordinates as string
   */
  // formatCoordinates(location: LocationCoordinates): string {
  //   return `${location.lat.toFixed(4)}, ${location.long.toFixed(4)}`;
  // }

  /**
   * Get location info as formatted string
   */
  // getLocationInfo(): Observable<string> {
  //   return this.getIpLocationDetails().pipe(
  //     map(data => `${data.city}, ${data.region}, ${data.country}`)
  //   );
  // }

  /**
   * Get location with all details
   */
  // getFullLocationInfo(): Observable<{
  //   coordinates: LocationCoordinates;
  //   city: string;
  //   region: string;
  //   country: string;
  //   timezone: string;
  // }> {
  //   return this.getIpLocationDetails().pipe(
  //     map(data => ({
  //       coordinates: {
  //         lat: data.latitude,
  //         long: data.longitude
  //       },
  //       city: data.city,
  //       region: data.region,
  //       country: data.country,
  //       timezone: data.timezone
  //     }))
  //   );
  // }

}
