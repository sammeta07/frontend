import { Component, OnInit, inject, DestroyRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationService } from '../../location.service';

interface Step {
  title: string;
  description: string;
  highlight?: string;
}

interface Browser {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-permission-instructions-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './permission-instructions-dialog.component.html',
  styleUrl: './permission-instructions-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionInstructionsDialogComponent implements OnInit {
  selectedBrowser: number = 0;
  userLocation: string = 'Fetching location...';

  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private locationService = inject(LocationService);

  browsers: Browser[] = [
    { name: 'Chrome', icon: 'language' },
    { name: 'Safari', icon: 'language' },
    { name: 'Firefox', icon: 'language' }
  ];

  chromeSteps: Step[] = [
    {
      title: 'Look for Security Icon',
      description: 'Find the Lock icon 🔒 at the left side of the address bar'
    },
    {
      title: 'Open Permissions',
      description: 'Click on the Lock/Info icon to display permissions menu'
    },
    {
      title: 'Find Location',
      description: 'Look for "Location" in the permissions dropdown',
      highlight: 'Status: Currently Blocked'
    },
    {
      title: 'Allow Location',
      description: 'Click on Location and select "Allow" from the dropdown',
      highlight: 'Status: Now Allowed ✓'
    }
  ];

  safariSteps: Step[] = [
    {
      title: 'Open Safari Menu',
      description: 'Click on "Safari" in the menu bar at the top'
    },
    {
      title: 'Settings for This Website',
      description: 'Select "Settings for This Website" from the dropdown'
    },
    {
      title: 'Find Location Setting',
      description: 'Look for "Location" option in the settings panel',
      highlight: 'Status: Currently Deny'
    },
    {
      title: 'Change to Allow',
      description: 'Click on Location dropdown and select "Allow"',
      highlight: 'Status: Now Allow ✓'
    }
  ];

  firefoxSteps: Step[] = [
    {
      title: 'Find Info Icon',
      description: 'Look for Info icon ⓘ on the left side of address bar'
    },
    {
      title: 'Expand Permissions',
      description: 'Click the info icon to expand permissions list'
    },
    {
      title: 'Locate Location',
      description: 'Find "Location" in the expanded permissions',
      highlight: 'Status: Currently Blocked'
    },
    {
      title: 'Enable Location',
      description: 'Click and change Location from "Block" to "Allow"',
      highlight: 'Status: Now Allowed ✓'
    }
  ];

  constructor(public dialogRef: MatDialogRef<PermissionInstructionsDialogComponent>) {}

  ngOnInit(): void {
    this.fetchUserLocation();
  }

  /**
   * Fetch user location from IP address
   */
  private fetchUserLocation(): void {
    this.locationService.getLocationInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (locationInfo: string) => {
          this.userLocation = locationInfo;
          this.cdr.markForCheck();
          console.log('User location:', this.userLocation);
        },
        error: (error) => {
          console.error('Error fetching location info:', error);
          this.userLocation = 'Unable to fetch location';
          this.cdr.markForCheck();
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  refreshPage(): void {
    window.location.reload();
  }
}
