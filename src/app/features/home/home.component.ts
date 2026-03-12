import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, OnInit, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventDetailsDialogComponent } from './dialogs/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from './dialogs/group-profile-dialog/group-profile-dialog.component';
import { JoinGroupDialogComponent } from './dialogs/join-group-dialog/join-group-dialog.component';
import { HomeService } from './services/home.service';
import { calculateStatus, getGroupLogoUrl, getYearLabel, sortEvents } from './utils/home.utils';
import { groupDetailsModel, eventDetailsModel, LocationModel } from './models/home.model';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    // SkeletonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
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

  groupSelectedDistance: number = 50;
  groupDistanceOptions: number[] = [1, 2, 3, 4, 5, 10, 20];
  eventSelectedDistance: number = 50;
  eventDistanceOptions: number[] = [1, 2, 3, 4, 5, 10, 20];
  groupSearchTerm: string = '';
  eventSearchTerm: string = '';
  
  samitiGroups: groupDetailsModel[] = [];
  allGroups: groupDetailsModel[] = [];
  allEvents: eventDetailsModel[] = [];

  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  locationName = this.locationService.userLocationName$;
  locationCords = this.locationService.userLocationCords$;
  groupsWidthPercent = 65;
  private readonly minGroupsWidthPercent = 35;
  private readonly maxGroupsWidthPercent = 75;
  isResizingPanels = false;

  get homeGridTemplateColumns(): string {
    return `${this.groupsWidthPercent}% 10px 1fr`;
  }

  accordion = viewChild.required(MatAccordion);

  ngOnInit() {
    this.fetchGroupsEventsPrograms();
  }

  fetchGroupsEventsPrograms() {
    this.homeService.getGroupsEventsPrograms().subscribe((data: groupDetailsModel[]) => {
      this.samitiGroups = data;
      this.allGroups = data;
      sortEvents(this.samitiGroups);
      this.samitiGroups.forEach(group => {
        group.events.forEach((event: eventDetailsModel) => {
          event.distanceFromUser = this.locationService.getDistanceFromUser(event.locationCords) || '';
          // this.locationService.reverseGeocode(event.locationCords).subscribe((name: string) => {
          //   event.locationName = name;
          // });
        });
        this.allEvents.push(...group.events);
        // Calculate and set distance from user's location for the group
        group.distanceFromUser = this.locationService.getDistanceFromUser(group.locationCords) || '';
        this.locationService.reverseGeocode(group.locationCords).subscribe((name: string) => {
          group.locationName = name;
        });
      })
      this.samitiGroups.sort((a, b) => a.title.localeCompare(b.title));
      this.allGroups.sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  onSearchGroups(event: Event) {
    const input = event.target as HTMLInputElement;
    this.groupSearchTerm = input.value.toLowerCase().trim();
  }

  onSearchEvents(event: Event) {
    const target = event.target as HTMLInputElement;
    this.eventSearchTerm = target.value;
  }

  onGroupDistanceChange(distance: number) {
    this.groupSelectedDistance = distance;
  }

  onEventDistanceChange(distance: number) {
    this.eventSelectedDistance = distance;
  }

  clearGroupSearch() {
    this.groupSearchTerm = '';
  }

  clearEventSearch() {
    this.eventSearchTerm = ''
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
