import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventDetailsDialogComponent } from './dialogs/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from './dialogs/group-profile-dialog/group-profile-dialog.component';
import { JoinGroupDialogComponent } from './dialogs/join-group-dialog/join-group-dialog.component';
import { CreateSamitiDialogComponent } from './dialogs/create-samiti-dialog/create-samiti-dialog.component';
import { HomeService } from './services/home.service';
import { calculateStatus, getGroupLogoUrl, getYearLabel, sortEvents } from './utils/home.utils';
import { groupDetailsModel, eventDetailsModel } from './models/home.model';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule,
    MatTabsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private homeService = inject(HomeService);
  // private locationService = inject(LocationService);
  private snackBar = inject(MatSnackBar);

  samitiGroups: groupDetailsModel[] = [];
  private allGroups: groupDetailsModel[] = [];
  years: number[] = [2027, 2026, 2025, 2024, 2023, 2022];
  selectedYearIndex: number = 0;
  searchTerm: string = '';
  carouselPagination = { clickable: true };
  carouselAutoplay = { delay: 3500, disableOnInteraction: false };
  
  // Expose utility functions to the template
  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  ngOnInit() {
    // Set current year as default selected tab
    const currentYear = new Date().getFullYear();
    const currentYearIndex = this.years.indexOf(currentYear);
    this.selectedYearIndex = currentYearIndex >= 0 ? currentYearIndex : 0;

    // this.initLocationAndFetch(currentYear);
  }

  ngOnDestroy() {
    // Clean up all auto-play intervals
    this.carouselIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.carouselIntervals.clear();
  }

  // private initLocationAndFetch(year: number) {
  //   const coords = this.locationService.getCoords();
  //   if (coords) {
  //     this.getGroupsAndEventsByLocationYear(coords.lat, coords.lng, year);
  //   } else {
  //     // Wait a moment for location service to get coords, then try again
  //     setTimeout(() => {
  //       const updatedCoords = this.locationService.getCoords();
  //       if (updatedCoords) {
  //         this.getGroupsAndEventsByLocationYear(updatedCoords.lat, updatedCoords.lng, year);
  //       } else {
  //         this.getGroupsAndEventsData();
  //       }
  //     }, 1000);
  //   }
  // }

  // getGroupsAndEventsData() {
  //   this.homeService.getGroupsAndEvents().subscribe((data: any[]) => {
  //     this.setGroupsData(data as groupDetailsModel[]);
  //   });
  // }

  // getGroupsAndEventsByLocationYear(lat: number, lng: number, year: number) {
  //   this.homeService.getGroupsAndEventsByLocationYear(lat, lng, year).subscribe((result) => {
  //     console.log(result);
  //     this.setGroupsData(result.groups);
  //   });
  // }

  // private setGroupsData(data: groupDetailsModel[]) {
  //   this.samitiGroups = data;
  //   this.allGroups = [...this.samitiGroups]; // Store original list
  //   calculateStatus(this.samitiGroups);
  //   // enrichGroupData(this.samitiGroups);
  //   sortEvents(this.samitiGroups);
  //   // Sort groups alphabetically by name
  //   this.samitiGroups.sort((a, b) => a.name.localeCompare(b.name));
  //   this.allGroups.sort((a, b) => a.name.localeCompare(b.name));
  // }

  onSearchGroups(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    
    if (!this.searchTerm) {
      // Reset to all groups if search is empty
      this.samitiGroups = [...this.allGroups];
    } else {
      // Filter groups by name, group ID, or location
      this.samitiGroups = this.allGroups.filter(group =>
        group.name.toLowerCase().includes(this.searchTerm) ||
        (group.groupId && group.groupId.toLowerCase().includes(this.searchTerm)) ||
        (group.location && group.location.toLowerCase().includes(this.searchTerm))
      );
    }
    // Maintain alphabetical order after search
    this.samitiGroups.sort((a, b) => a.name.localeCompare(b.name));
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.searchTerm = '';
    this.samitiGroups = [...this.allGroups];
    this.samitiGroups.sort((a, b) => a.name.localeCompare(b.name));
  }

  onCreateSamiti() {
    const dialogRef = this.dialog.open(CreateSamitiDialogComponent, {
      position: { right: '0', top: '0' },
      height: '100%',
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'slide-in-dialog',
      autoFocus: false,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('New Samiti Created:', result);
      if (0) {
        // logic to add new samiti to the list
        const newGroup = result as groupDetailsModel;
        newGroup.id = this.samitiGroups.length + 1; // simple id generation
        this.samitiGroups.unshift(newGroup);
        // enrichGroupData([newGroup]); // Create placeholder members etc
      }
    });
  }

  openEventDetails(event: eventDetailsModel) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '800px',
      data: event,
      autoFocus: false 
    });
  }

  openGroupProfile(group: groupDetailsModel) {
    this.dialog.open(GroupProfileDialogComponent, {
      width: '500px',
      data: group,
      autoFocus: false
    });
  }

  openMap(location: string) {
    if (location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  }

  openJoinGroupDialog(group: groupDetailsModel) {
    this.dialog.open(JoinGroupDialogComponent, {
      width: '400px',
      data: group,
      autoFocus: false
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Group ID copied to clipboard:', text);
      this.snackBar.open(`Group Id '${text}' copied to clipboard`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['copy-snackbar']
      });
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      this.snackBar.open('Failed to copy Group Id', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    });
  }

  // Carousel Methods
  getCarouselIndex(eventId: number): number {
    // Initialize auto-play when carousel index is first accessed
    if (!this.carouselIndices.has(eventId)) {
      this.carouselIndices.set(eventId, 0);
      this.startAutoPlay(eventId);
    }
    return this.carouselIndices.get(eventId) ?? 0;
  }

  nextImage(eventId: number) {
    const event = this.samitiGroups
      .flatMap(g => g.events)
      .find(e => e.id === eventId);
    
    if (event && event.images && event.images.length > 0) {
      const currentIndex = this.getCarouselIndex(eventId);
      const nextIndex = (currentIndex + 1) % event.images.length;
      this.carouselIndices.set(eventId, nextIndex);
      // Reset auto-play when user manually navigates
      this.restartAutoPlay(eventId);
    }
  }

  previousImage(eventId: number) {
    const event = this.samitiGroups
      .flatMap(g => g.events)
      .find(e => e.id === eventId);
    
    if (event && event.images && event.images.length > 0) {
      const currentIndex = this.getCarouselIndex(eventId);
      const previousIndex = (currentIndex - 1 + event.images.length) % event.images.length;
      this.carouselIndices.set(eventId, previousIndex);
      // Reset auto-play when user manually navigates
      this.restartAutoPlay(eventId);
    }
  }

  setCarouselIndex(eventId: number, index: number) {
    const event = this.samitiGroups
      .flatMap(g => g.events)
      .find(e => e.id === eventId);
    
    if (event && event.images && index >= 0 && index < event.images.length) {
      this.carouselIndices.set(eventId, index);
      // Reset auto-play when user manually navigates
      this.restartAutoPlay(eventId);
    }
  }

  // Auto-play methods
  private startAutoPlay(eventId: number) {
    // Don't start if the carousel interval already exists
    if (this.carouselIntervals.has(eventId)) {
      return;
    }

    const intervalId = setInterval(() => {
      const event = this.samitiGroups
        .flatMap(g => g.events)
        .find(e => e.id === eventId);
      
      if (event && event.images && event.images.length > 0) {
        const currentIndex = this.carouselIndices.get(eventId) ?? 0;
        const nextIndex = (currentIndex + 1) % event.images.length;
        this.carouselIndices.set(eventId, nextIndex);
      }
    }, this.AUTO_PLAY_INTERVAL);

    this.carouselIntervals.set(eventId, intervalId);
  }

  private restartAutoPlay(eventId: number) {
    // Clear existing interval
    const existingInterval = this.carouselIntervals.get(eventId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }
    
    // Start a new interval
    this.startAutoPlay(eventId);
  }
}
