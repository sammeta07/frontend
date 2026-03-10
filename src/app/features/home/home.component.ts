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
import { groupDetailsModel, eventDetailsModel, LocationModel } from './models/home.model';
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
  locationCords = this.locationService.locationCords$;
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
    const loc = this.locationCords();
    const locName = this.locationName();
    if (loc) {
      // Recalculate distances for all groups and events when user's location is updated
      this.allGroups.forEach((group: groupDetailsModel) => {
        group.distanceFromUser = this.locationService.calculateDistance(loc, group.locationCords);
        // this.locationService.reverseGeocode(group.locationCords).subscribe((name: string) => {
        //   group.locationName = name;
        // });
        group.events.forEach((event: eventDetailsModel) => {
          event.distanceFromUser = this.locationService.calculateDistance(loc, event.locationCords);
          // this.locationService.reverseGeocode(event.locationCords).subscribe((name: string) => {
          //   event.locationName = name;
          // });
         });
      });
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
        // Calculate distance for each event in the group
        group.events.forEach((event: eventDetailsModel) => {
          event.distanceFromUser = Number(this.locationService.getDistanceFromUser(event.locationCords)) || 0;
          // this.locationService.reverseGeocode(event.locationCords).subscribe((name: string) => {
          //   event.locationName = name;
          // });
        });
        this.allEvents.push(...group.events);
        // Calculate and set distance from user's location for the group
        group.distanceFromUser = Number(this.locationService.getDistanceFromUser(group.locationCords)) || 0;
        this.locationService.reverseGeocode(group.locationCords).subscribe((name: string) => {
          group.locationName = name;
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
    if (!this.locationCords()) {
      this.samitiGroups = [...this.allGroups];
      return;
    }
    const userLocation = this.locationCords()!;
    // Attach distance to each group for sorting and display
    this.samitiGroups = this.allGroups
      .map((group: groupDetailsModel) => {
        const dist = this.locationService.calculateDistance(userLocation, group.locationCords);
        // Type assertion to allow extra property
        return { ...group, distanceFromUser: dist } as groupDetailsModel & { distanceFromUser: number };
      })
      .filter(group => group.distanceFromUser <= this.selectedDistance)
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  }

  onSearchGroups() {
    if (!this.locationCords()) {
      this.samitiGroups = [...this.allGroups];
      return;
    }
    const userLocation = this.locationCords()!;
    // First filter by distance
    let filtered = this.allGroups
      .map((group: groupDetailsModel) => {
        const dist = this.locationService.calculateDistance(userLocation, group.locationCords);
        return { ...group, distanceFromUser: dist } as groupDetailsModel & { distanceFromUser: number };
      })
      .filter((group: groupDetailsModel & { distanceFromUser: number }) => group.distanceFromUser <= this.selectedDistance);

    // Then filter by search term if present
    if (this.searchTerm) {
      filtered = filtered.filter((group: groupDetailsModel) =>
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
    
    // First filter by currentStatus === 'started'
    let filtered = this.allEvents.filter((event) => 
      event.currentStatus?.toLowerCase() === 'started'
    );

    // Then filter by distance if location is available
    if (this.locationCords()) {
      const userLocation = this.locationCords()!;
      
      filtered = filtered.filter((event) => {
        if (event.locationCords && event.locationCords.lat && event.locationCords.long) {
          const dist = this.locationService.calculateDistance(userLocation, event.locationCords);
          return dist <= this.selectedDistance;
        }
        return false;
      });
    }

    // Finally filter by search term if present
    if (term) {
      filtered = filtered.filter((event) =>
        (event.title || '').toLowerCase().includes(term)
      );
    }

    return filtered;
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

  openMap(location: LocationModel) {
    if (location && location.lat && location.long) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`, '_blank');
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

  getDistanceInMetersFromYou(distanceFromUser: number | string | undefined | null): string {
    if (distanceFromUser === null || distanceFromUser === undefined || distanceFromUser === '') {
      return 'Calculating distance...';
    }

    if (typeof distanceFromUser === 'number' && Number.isFinite(distanceFromUser)) {
      return distanceFromUser < 1
        ? `${Math.round(distanceFromUser * 1000)} m from you`
        : `${distanceFromUser.toFixed(1)} km from you`;
    }

    if (typeof distanceFromUser === 'string') {
      const normalized = distanceFromUser.trim().toLowerCase();
      if (normalized.includes('m from you')) {
        return distanceFromUser;
      }
      if (normalized.includes('km from you')) {
        const kmValue = parseFloat(normalized);
        if (!Number.isNaN(kmValue)) {
          return kmValue < 1
            ? `${Math.round(kmValue * 1000)} m from you`
            : `${kmValue.toFixed(1)} km from you`;
        }
      }
      const rawValue = parseFloat(normalized);
      if (!Number.isNaN(rawValue)) {
        return rawValue < 1
          ? `${Math.round(rawValue * 1000)} m from you`
          : `${rawValue.toFixed(1)} km from you`;
      }
    }

    return 'Calculating distance...';
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
