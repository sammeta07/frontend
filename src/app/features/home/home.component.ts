import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, OnInit, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventDetailsDialogComponent } from './dialogs/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from './dialogs/group-profile-dialog/group-profile-dialog.component';
import { JoinGroupDialogComponent } from './dialogs/join-group-dialog/join-group-dialog.component';
import { CreateSamitiDialogComponent } from './dialogs/create-samiti-dialog/create-samiti-dialog.component';
import { HomeService } from './services/home.service';
import { calculateStatus, getGroupLogoUrl, getYearLabel, sortEvents } from './utils/home.utils';
import { groupDetailsModel, eventDetailsModel } from './models/home.model';
import { MatTabsModule } from '@angular/material/tabs';
import { LocationService } from '../../shared/location.service';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule,
    MatTabsModule,
    // SkeletonComponent,
    MatSelectModule,
    MatExpansionModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private locationService = inject(LocationService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  selectedDistance: number = 50;
  years: number[] = [2027, 2026, 2025, 2024, 2023, 2022];

  
  selectedYearIndex: number = 0;
  searchTerm: string = '';
  eventSearchTerm: string = '';
  carouselPagination = { clickable: true };
  carouselAutoplay = { delay: 3500, disableOnInteraction: false };
  
  samitiGroups: groupDetailsModel[] = [];
  private allGroups: groupDetailsModel[] = [];
  allEvents: eventDetailsModel[] = [];

  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  locationName = this.locationService.locationName$;
  location = this.locationService.location$;
  groupsWidthPercent = 65;
  private readonly minGroupsWidthPercent = 35;
  private readonly maxGroupsWidthPercent = 75;
  isResizingPanels = false;

  get homeGridTemplateColumns(): string {
    return `${this.groupsWidthPercent}% 10px 1fr`;
  }


  accordion = viewChild.required(MatAccordion);


  searchTermEffect = effect(() => {
    this.searchTerm = this.homeService.searchTerm();
    if(this.searchTerm === ''){
      this.clearSearch();
    }else if(this.searchTerm){
      this.onSearchGroups();
    }
  });

  selectedDistanceEffect = effect(() => {
    this.selectedDistance = this.homeService.selectedDistance();
    this.filterGroupsByDistance();
  });

  locationEffect = effect(() => {
    const loc = this.location();
    const locName = this.locationName();
    if (loc) {
      this.filterGroupsByDistance();
    }
  });

  ngOnInit() {
    this.searchTerm = '';
    // if (this.location()) {
    //   this.filterGroupsByDistance();
    // }
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
      sortEvents(this.samitiGroups);
      // enrichGroupData(this.samitiGroups);
      // Sort groups alphabetically by name
      this.samitiGroups.forEach(group => {
        this.allEvents.push(...group.events);
        // this.allEvents.forEach(event => {
        //   event.locationName = 'Fetching location...';
        //   this.locationService.reverseGeocode(event.location).subscribe({
        //     next: (readableLocation: string) => {
        //       event.locationName = readableLocation;
        //     },
        //     error: (error) => {
        //       event.locationName = 'Unknown Location';
        //     }
        //   });
        // });
        group.locationName = 'Fetching location...';
        this.locationService.reverseGeocode(group.location).subscribe({
          next: (readableLocation: string) => {
            group.locationName = readableLocation;
          },
          error: (error) => {
            group.locationName = 'Unknown Location';
          }
        });
      })
      this.samitiGroups.sort((a, b) => a.name.localeCompare(b.name));
      this.allGroups.sort((a, b) => a.name.localeCompare(b.name));
      this.filterGroupsByDistance();
    });
  }

  onDistanceChange(distance: number) {
    this.selectedDistance = distance;
    this.filterGroupsByDistance();
  }

  filterGroupsByDistance() {
    if (!this.location()) {
      this.samitiGroups = [...this.allGroups];
      return;
    }
    const userLat = this.location()!.lat;
    const userLong = this.location()!.long;
    // Attach distance to each group for sorting and display
    this.samitiGroups = this.allGroups
      .map(group => {
        const dist = this.calculateDistance(
          userLat,
          userLong,
          group.location.lat,
          group.location.long
        );
        // Type assertion to allow extra property
        return { ...group, distanceFromUser: dist } as groupDetailsModel & { distanceFromUser: number };
      })
      .filter(group => group.distanceFromUser <= this.selectedDistance)
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  }

  // Haversine formula to calculate distance between two lat/long points in km
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  onSearchGroups() {
    if (!this.location()) {
      this.samitiGroups = [...this.allGroups];
      return;
    }
    const userLat = this.location()!.lat;
    const userLong = this.location()!.long;
    // First filter by distance
    let filtered = this.allGroups
      .map(group => {
        const dist = this.calculateDistance(
          userLat,
          userLong,
          group.location.lat,
          group.location.long
        );
        return { ...group, distanceFromUser: dist } as groupDetailsModel & { distanceFromUser: number };
      })
      .filter(group => group.distanceFromUser <= this.selectedDistance);

    // Then filter by search term if present
    if (this.searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(this.searchTerm) ||
        (group.groupId && group.groupId.toLowerCase().includes(this.searchTerm)) ||
        (group.locationName && group.locationName.toLowerCase().includes(this.searchTerm))
      );
    }
    // Sort by distance
    this.samitiGroups = filtered.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  }

  clearSearch() {
    this.searchTerm = '';
    this.samitiGroups = [...this.allGroups];
    this.filterGroupsByDistance();
  }

  get filteredAllEvents(): eventDetailsModel[] {
    const term = this.eventSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.allEvents;
    }

    return this.allEvents.filter((event) =>
      (event.title || '').toLowerCase().includes(term)
    );
  }

  onSearchEvents(event: Event) {
    const target = event.target as HTMLInputElement;
    this.eventSearchTerm = target.value;
  }

  clearEventSearch(searchInput: HTMLInputElement) {
    this.eventSearchTerm = '';
    searchInput.value = '';
    searchInput.focus();
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

  scrollToGroups() {
    const el = document.querySelector('.near-you-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      this.snackBar.open(`Group Id '${text}' copied to clipboard`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['copy-snackbar']
      });
    }).catch(err => {
      this.snackBar.open('Failed to copy Group Id', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    });
  }

  onResizeStart(event: MouseEvent) {
    event.preventDefault();
    this.isResizingPanels = true;
    document.body.classList.add('is-resizing-panels');
  }

  @HostListener('document:mousemove', ['$event'])
  onPanelResize(event: MouseEvent) {
    if (!this.isResizingPanels) {
      return;
    }

    const container = document.querySelector('.home-container') as HTMLElement | null;
    if (!container) {
      return;
    }

    const bounds = container.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const nextWidthPercent = (pointerX / bounds.width) * 100;

    this.groupsWidthPercent = Math.min(
      this.maxGroupsWidthPercent,
      Math.max(this.minGroupsWidthPercent, nextWidthPercent)
    );
  }

  @HostListener('document:mouseup')
  onResizeEnd() {
    if (!this.isResizingPanels) {
      return;
    }

    this.isResizingPanels = false;
    document.body.classList.remove('is-resizing-panels');
  }
}
