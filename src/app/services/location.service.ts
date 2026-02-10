import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationLabelSubject = new BehaviorSubject<string>('Detecting your location...');
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private coordsSubject = new BehaviorSubject<{ lat: number; lng: number } | null>(null);

  locationLabel$ = this.locationLabelSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  coords$ = this.coordsSubject.asObservable();

  getLocationLabel(): string {
    return this.locationLabelSubject.value;
  }

  getIsLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  getCoords() {
    return this.coordsSubject.value;
  }

  initializeLocation(): void {
    if (!navigator.geolocation) {
      this.locationLabelSubject.next('Location unavailable');
      this.isLoadingSubject.next(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.coordsSubject.next({ lat: latitude, lng: longitude });
        this.locationLabelSubject.next(`Lat ${latitude.toFixed(2)}, Lng ${longitude.toFixed(2)}`);
        this.isLoadingSubject.next(false);
      },
      () => {
        this.locationLabelSubject.next('Location unavailable');
        this.isLoadingSubject.next(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  }
}
