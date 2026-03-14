import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, OnInit, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { EventDetailsDialogComponent } from './dialogs/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from './dialogs/group-profile-dialog/group-profile-dialog.component';
import { JoinGroupDialogComponent } from './dialogs/join-group-dialog/join-group-dialog.component';
import { HomeService } from './services/home.service';
import { getGroupLogoUrl, getYearLabel, sortEventsByStatus, sortGroupsByDistance, sortProgramsByDistance } from './utils/home.utils';
import { GroupDetailsModel, EventDetailsModel, ProgramDetailWithContextModel } from './models/home.model';
import { LocationModel } from './models/home.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocationService } from '../../shared/location.service';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { firstValueFrom } from 'rxjs';

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
    MatTabsModule,
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

  groupSearchTerm: string = '';
  groupSelectedDistance: number = 5;
  groupDistanceOptions: number[] = [1, 2, 3, 4, 5, 10, 20];
  
  programSearchTerm: string = '';
  programSelectedDistance: number = 5;
  programDistanceOptions: number[] = [1, 2, 3, 4, 5, 10, 20];
  
  samitiGroups: GroupDetailsModel[] = [];
  samitiGroupsCopy: GroupDetailsModel[] = [];
  programsData: ProgramDetailWithContextModel[] = [];

  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  userLocationName = this.locationService.userLocationName$;
  userLocationCords = this.locationService.userLocationCords$;
  private hasFetchedGroupsEventsPrograms = false;

  groupsWidthPercent = 65;
  private readonly minGroupsWidthPercent = 35;
  private readonly maxGroupsWidthPercent = 75;
  isResizingPanels = false;

  get homeGridTemplateColumns(): string {
    return `${this.groupsWidthPercent}% 10px 1fr`;
  }

  accordion = viewChild.required(MatAccordion);

  constructor() {
    effect(() => {
      const cords = this.userLocationCords();
      if (cords && !this.hasFetchedGroupsEventsPrograms) {
        this.hasFetchedGroupsEventsPrograms = true;
        void this.fetchGroupsEventsPrograms();
      }
    });
  }

  ngOnInit() {
  }

  async fetchGroupsEventsPrograms(): Promise<void> {
    try {
      const data = await firstValueFrom(this.homeService.getGroupsEventsPrograms());

      this.samitiGroups = data ?? [];
      this.samitiGroupsCopy = [...this.samitiGroups];

      await this.populateDistancesSequentially(this.samitiGroups);
      await this.applyStatusAndSortingSequentially(this.samitiGroups);
      this.populateProgramsData(this.samitiGroups);
    } catch (error) {
      this.hasFetchedGroupsEventsPrograms = false;
      console.error('Failed to fetch groups/events/programs', error);
    }
  }

  private async populateDistancesSequentially(groups: GroupDetailsModel[]): Promise<void> {
    for (const group of groups) {
      group.distanceFromUser =
        (await Promise.resolve(this.locationService.getDistanceFromUser(group.locationCords))) || '';

      for (const event of group.events ?? []) {
        event.distanceFromUser =
          (await Promise.resolve(this.locationService.getDistanceFromUser(event.locationCords))) || '';

        for (const program of event.programs ?? []) {
          program.distanceFromUser =
            (await Promise.resolve(this.locationService.getDistanceFromUser(program.locationCords))) || '';
        }
      }
    }
  }

  private async applyStatusAndSortingSequentially(groups: GroupDetailsModel[]): Promise<void> {
    await Promise.resolve(sortEventsByStatus(groups));
    await Promise.resolve(sortGroupsByDistance(groups));
    await Promise.resolve(sortProgramsByDistance(groups));
  }

  private populateProgramsData(groups: GroupDetailsModel[]): void {
    this.programsData = [];

    for (const group of groups) {
      for (const event of group.events ?? []) {
        for (const program of event.programs ?? []) {
          this.programsData.push({
            ...program,
            eventTitle: event.title,
            groupTitle: group.title,
          });
        }
      }
    }
  }

  get programTypes(): string[] {
    return [...new Set(this.programsData.map((program) => program.type))];
  }

  getProgramsByType(type: string): ProgramDetailWithContextModel[] {
    return this.programsData.filter((program) => program.type === type);
  }

  onSearchGroups(event: Event) {
    const input = event.target as HTMLInputElement;
    this.groupSearchTerm = input.value.toLowerCase().trim();
  }

  onSearchProgram(event: Event) {
    const target = event.target as HTMLInputElement;
    this.programSearchTerm = target.value;
  }

  onGroupDistanceChange(distance: number) {
    this.groupSelectedDistance = distance;
  }

  onProgramDistanceChange(distance: number) {
    this.programSelectedDistance = distance;
  }

  clearGroupSearch() {
    this.groupSearchTerm = '';
  }

  clearProgramSearch() {
    this.programSearchTerm = ''
  }

  openProgramDetails(event: EventDetailsModel) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '800px',
      data: event,
      autoFocus: false 
    });
  }

  openEventDetails(event: EventDetailsModel) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '800px',
      data: event,
      autoFocus: false 
    });
  }

  openGroupProfile(group: GroupDetailsModel) {
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

  openJoinGroupDialog(group: GroupDetailsModel) {
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
