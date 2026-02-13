import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface IpLocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  postal: string;
  timezone: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly IP_LOCATION_API_URL = 'https://ipapi.co/json/';
  private readonly REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  /**
   * Browser se coordinates lene ka promise function
   */
  getGeolocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }

  /**
   * Get location from IP address using ipapi.co free API
   * Returns location coordinates (lat, lng)
   */
  getIpLocation(): Observable<LocationCoordinates> {
    return this.http.get<IpLocationData>(this.IP_LOCATION_API_URL).pipe(
      map(data => ({
        lat: data.latitude,
        lng: data.longitude
      })),
      catchError(error => {
        console.error('Error fetching IP location:', error);
        // Fallback to default coordinates (India center)
        return of({ lat: 20.5937, lng: 78.9629 });
      })
    );
  }

  /**
   * Get full IP location details
   */
  getIpLocationDetails(): Observable<IpLocationData> {
    return this.http.get<IpLocationData>(this.IP_LOCATION_API_URL).pipe(
      catchError(error => {
        console.error('Error fetching IP location details:', error);
        // Return default country data
        return of({
          ip: 'unknown',
          city: 'Unknown',
          region: 'Unknown',
          country: 'India',
          latitude: 20.5937,
          longitude: 78.9629,
          postal: 'Unknown',
          timezone: 'UTC'
        });
      })
    );
  }

  /**
   * Format coordinates as string
   */
  formatCoordinates(location: LocationCoordinates): string {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  }

  /**
   * Get location info as formatted string
   */
  getLocationInfo(): Observable<string> {
    return this.getIpLocationDetails().pipe(
      map(data => `${data.city}, ${data.region}, ${data.country}`)
    );
  }

  /**
   * Get location with all details
   */
  getFullLocationInfo(): Observable<{
    coordinates: LocationCoordinates;
    city: string;
    region: string;
    country: string;
    timezone: string;
  }> {
    return this.getIpLocationDetails().pipe(
      map(data => ({
        coordinates: {
          lat: data.latitude,
          lng: data.longitude
        },
        city: data.city,
        region: data.region,
        country: data.country,
        timezone: data.timezone
      }))
    );
  }

  /**
   * Convert coordinates to readable location name using reverse geocoding
   */
  reverseGeocode(coord: LocationCoordinates): Observable<string> {
    const params = {
      format: 'json',
      lat: coord.lat.toString(),
      lon: coord.lng.toString(),
      zoom: '10'
    };

    return this.http.get<any>(this.REVERSE_GEOCODING_API, { params }).pipe(
      map(data => {
        const address = data.address || {};
        console.log('Nominatim API Response Address:', address);
        
        // Try multiple fields for city name
        const city = 
          address.state_district || 'Unknown';
        
        // Try multiple fields for state/region
        const state = 
          address.state || 'Unknown';
        
        const country = address.country || 'Unknown';
        
        // const result = `${city}, ${state}, ${country}`;
         const result = `${city}, ${state}`;
        console.log('Formatted location:', result);
        return result;
      }),
      catchError(error => {
        console.error('Error reverse geocoding:', error);
        return this.getLocationInfo(); // Fallback to IP-based location
      })
    );
  }
  calculateDistance(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) *
        Math.cos(coord2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
