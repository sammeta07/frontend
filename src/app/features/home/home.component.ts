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
import { LocationService } from '../../location.service';

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
})
export class HomeComponent implements OnInit {
  private dialog = inject(MatDialog);
  private homeService = inject(HomeService);
  private snackBar = inject(MatSnackBar);
  private locationService = inject(LocationService);
  locationName$ = this.locationService.locationName$;
  
  samitiGroups: groupDetailsModel[] = [];
  private allGroups: groupDetailsModel[] = [];
  years: number[] = [2027, 2026, 2025, 2024, 2023, 2022];
  selectedYearIndex: number = 0;
  searchTerm: string = '';
  carouselPagination = { clickable: true };
  carouselAutoplay = { delay: 3500, disableOnInteraction: false };
  isLocationLoading: boolean = true;
  // Expose utility functions to the template
  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  ngOnInit() {

    this.locationService.locationName$.subscribe(location => {
      console.log('User location updated:', location);
      // Trigger change detection to update the UI with the new location
    });
    // Set current year as default selected tab
    const currentYear = new Date().getFullYear();
    const currentYearIndex = this.years.indexOf(currentYear);
    this.selectedYearIndex = currentYearIndex >= 0 ? currentYearIndex : 0;
    
    this.getGroupsAndEventsData();
  }

  getGroupsAndEventsData() {
    this.homeService.getGroupsAndEvents().subscribe((data: any[]) => {
      this.samitiGroups = data as groupDetailsModel[];
      this.allGroups = [...this.samitiGroups]; // Store original list
      calculateStatus(this.samitiGroups);
      // enrichGroupData(this.samitiGroups);
      sortEvents(this.samitiGroups);
      // Sort groups alphabetically by name
      this.samitiGroups.sort((a, b) => a.name.localeCompare(b.name));
      this.allGroups.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

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
}
