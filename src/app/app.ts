import { Component, signal, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PermissionInstructionsDialogComponent } from './components/permission-instructions-dialog/permission-instructions-dialog.component';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationService } from './location.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  sidebarWidth: number = 280; // Default width
  isResizing: boolean = false;
  showSidebar = signal(true);
  location: { lat: number; lng: number } | null = null;
  readableLocation: string = '';
  private router = inject(Router);
  private locationService = inject(LocationService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.detectLocation();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      this.showSidebar.set(!isHome);
    });
  }

  async detectLocation() {
    try {
      // First check what the permission status is
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

      if (permissionStatus.state === 'denied') {
        // If user has blocked location, show instructions dialog
        this.dialog.open(PermissionInstructionsDialogComponent, {
          // width: '100%',
          // maxWidth: '90vw',
          autoFocus: false,
          disableClose: true
        });
        return;
      }

      // If not denied, this line will trigger browser's default permission popup
      const pos = await this.locationService.getGeolocation();
      this.location = pos;
      this.cdr.markForCheck();
      console.log('Browser geolocation coordinates:', this.location);
      
      // Convert coordinates to readable location name
      this.locationService.reverseGeocode(pos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (readableLocation: string) => {
            this.readableLocation = readableLocation;
            this.cdr.markForCheck();
            console.log('Converted to readable location:', this.readableLocation);
          },
          error: (error) => {
            console.error('Error converting to readable location:', error);
            this.readableLocation = 'Location detected';
            this.cdr.markForCheck();
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

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault(); // Prevent text selection
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    // Set sidebar's new width (with min 150px and max 500px limit)
    if (event.clientX >= 250 && event.clientX <= 700) {
      this.sidebarWidth = event.clientX;
    }
  }

  onMouseUp() {
    this.isResizing = false;
  }
}
