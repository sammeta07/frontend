import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, OnInit, effect, viewChild, ViewChild } from '@angular/core';
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
import { getGroupLogoUrl, getYearLabel, sortEventsByStatus, sortGroupsByDistance, sortProgramsByDistance, programTypeSortOrder } from './utils/home.utils';
import { GroupDetailsModel, EventDetailsModel, ProgramDetailModel, ProgramDetailWithContextModel } from './models/home.model';
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

  get filteredSamitiGroups(): GroupDetailsModel[] {
    const term = this.groupSearchTerm.toLowerCase();
    const maxDistanceMeters = this.groupSelectedDistance * 1000;

    return this.samitiGroups.filter((group) => {
      const distanceMeters = this.parseDistanceToMeters(group.distanceFromUser);
      if (distanceMeters > maxDistanceMeters) return false;

      if (!term) return true;
      return (
        group.title?.toLowerCase().includes(term) ||
        group.locationName?.toLowerCase().includes(term) ||
        group.groupId?.toLowerCase().includes(term)
      );
    });
  }

  readonly currentYear = new Date().getFullYear();
  readonly groupEventYearOffsets: number[] = [1, 0, -1, -2, -3, -4];
  readonly groupEventTabs: number[] = this.groupEventYearOffsets.map((offset) => this.currentYear + offset);
  private groupSelectedYear = new Map<number, number>();

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

      await this.populateGroupLocationNamesSequentially(this.samitiGroups);
      await this.populateDistancesSequentially(this.samitiGroups);
      await this.applyStatusAndSortingSequentially(this.samitiGroups);
      this.samitiGroupsCopy = [...this.samitiGroups];
      this.populateProgramsData(this.samitiGroups);
    } catch (error) {
      this.hasFetchedGroupsEventsPrograms = false;
      console.error('Failed to fetch groups/events/programs', error);
    }
  }

  onGroupEventTabChange(group: GroupDetailsModel, tabIndex: number): void {
    const year = this.groupEventTabs[tabIndex];
    if (!year) {
      return;
    }

    this.groupSelectedYear.set(group.id, year);
  }

  getGroupEventTabIndex(group: GroupDetailsModel): number {
    const selectedYear = this.groupSelectedYear.get(group.id) ?? this.currentYear;
    const index = this.groupEventTabs.indexOf(selectedYear);
    return index >= 0 ? index : 1;
  }

  getGroupEventTabLabel(tab: number): string {
    return String(tab);
  }

  getGroupEventsByTab(group: GroupDetailsModel, tab: number): EventDetailsModel[] {
    const events = group.events ?? [];
    const statusOrder: Record<'completed' | 'live' | 'upcoming', number> = {
      live: 0,
      upcoming: 1,
      completed: 2,
    };

    return events
      .filter((event) => this.eventFallsInYear(event, tab))
      .sort((a, b) => {
        const statusA = statusOrder[this.getEventStatus(a)];
        const statusB = statusOrder[this.getEventStatus(b)];
        if (statusA !== statusB) {
          return statusA - statusB;
        }

        const startA = this.getEventDateBoundary(a.start_date, false)?.getTime() ?? Number.POSITIVE_INFINITY;
        const startB = this.getEventDateBoundary(b.start_date, false)?.getTime() ?? Number.POSITIVE_INFINITY;
        return startA - startB;
      });
  }

  private eventFallsInYear(event: EventDetailsModel, year: number): boolean {
    const startYear = this.extractYear(event.start_date);
    const endYear = this.extractYear(event.end_date);

    if (startYear !== null && endYear !== null) {
      return year >= Math.min(startYear, endYear) && year <= Math.max(startYear, endYear);
    }
    if (startYear !== null) {
      return startYear === year;
    }
    if (endYear !== null) {
      return endYear === year;
    }
    return false;
  }

  private extractYear(dateValue: string | undefined): number | null {
    if (!dateValue) {
      return null;
    }

    const [year] = dateValue.split('-').map(Number);
    return Number.isInteger(year) && year > 0 ? year : null;
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

  private async populateGroupLocationNamesSequentially(groups: GroupDetailsModel[]): Promise<void> {
    for (const group of groups) {
      if (group.locationName?.trim()) {
        continue;
      }

      group.locationName = await firstValueFrom(this.locationService.getAreaName(group.locationCords));
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
            year_count: event.year_count,
          });
        }
      }
    }
  }

  get programTypes(): string[] {
    return [...new Set(this.programsData.map((program) => program.type))].sort(
      (a, b) =>
        (programTypeSortOrder[a] ?? Number.MAX_SAFE_INTEGER) -
        (programTypeSortOrder[b] ?? Number.MAX_SAFE_INTEGER)
    );
  }

  getProgramsByType(type: string): ProgramDetailWithContextModel[] {
    const statusOrder: Record<'live' | 'upcoming' | 'completed', number> = {
      live: 0,
      upcoming: 1,
      completed: 2,
    };

    const term = this.programSearchTerm.toLowerCase().trim();
    const maxDistanceMeters = this.programSelectedDistance * 1000;

    return this.programsData
      .filter((program) => {
        if (program.type !== type) return false;
        const distanceMeters = this.parseDistanceToMeters(program.distanceFromUser);
        if (distanceMeters > maxDistanceMeters) return false;
        if (!term) return true;
        return (
          program.title?.toLowerCase().includes(term) ||
          program.groupTitle?.toLowerCase().includes(term) ||
          program.eventTitle?.toLowerCase().includes(term) ||
          program.locationName?.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const statusA = statusOrder[this.getProgramStatus(a)];
        const statusB = statusOrder[this.getProgramStatus(b)];
        if (statusA !== statusB) {
          return statusA - statusB;
        }

        const distanceA = this.parseDistanceToMeters(a.distanceFromUser);
        const distanceB = this.parseDistanceToMeters(b.distanceFromUser);
        if (distanceA !== distanceB) {
          return distanceA - distanceB;
        }

        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      });
  }

  getEventCountByType(type: string): number {
    const uniqueEvents = new Set(
      this.programsData
        .filter((program) => program.type === type)
        .map((program) => `${program.groupTitle}::${program.eventTitle}`)
    );

    return uniqueEvents.size;
  }

  getProgramStatus(program: ProgramDetailWithContextModel): 'live' | 'upcoming' | 'completed' {
    const startDateTime = this.getProgramDateTime(program.date, program.from_time, false);
    const endDateTime = this.getProgramDateTime(program.date, program.to_time, true);
    return this.resolveTemporalStatus(startDateTime, endDateTime);
  }

  getProgramStatusLabel(program: ProgramDetailWithContextModel): string {
    switch (this.getProgramStatus(program)) {
      case 'live':
        return 'Live';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Completed';
    }
  }

  getEventStatus(event: EventDetailsModel): 'live' | 'upcoming' | 'completed' {
    const startDate = this.getEventDateBoundary(event.start_date, false);
    const endDate = this.getEventDateBoundary(event.end_date, true);
    return this.resolveTemporalStatus(startDate, endDate);
  }

  getEventStatusLabel(event: EventDetailsModel): string {
    switch (this.getEventStatus(event)) {
      case 'live':
        return 'Started';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Completed';
    }
  }

  getEventDurationLabel(event: EventDetailsModel): string {
    if (!event.start_date || !event.end_date) {
      return '';
    }

    const start = this.getDateOnly(event.start_date);
    const end = this.getDateOnly(event.end_date);
    if (!start || !end) {
      return '';
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const dayCount = Math.max(1, Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
    return `${dayCount} Day${dayCount !== 1 ? 's' : ''}`;
  }

  getEventProgramCountLabel(event: EventDetailsModel): string {
    const durationLabel = this.getEventDurationLabel(event);
    const programCount = event.programs?.length ?? 0;
    const programLabel = `${programCount} Program${programCount !== 1 ? 's' : ''}`;

    return durationLabel ? `${durationLabel} / ${programLabel}` : programLabel;
  }

  getNextProgramInEvent(event: EventDetailsModel): ProgramDetailModel | null {
    const programs = [...(event.programs ?? [])]
      .filter((program) => !!program.date)
      .sort((first, second) => {
        const firstDate = this.getProgramDateTime(first.date, first.from_time, false)?.getTime() ?? Number.POSITIVE_INFINITY;
        const secondDate = this.getProgramDateTime(second.date, second.from_time, false)?.getTime() ?? Number.POSITIVE_INFINITY;
        return firstDate - secondDate;
      });

    if (!programs.length) {
      return null;
    }

    const now = new Date();
    const liveProgram = programs.find((program) => {
      const startDate = this.getProgramDateTime(program.date, program.from_time, false);
      const endDate = this.getProgramDateTime(program.date, program.to_time, true);

      return !!startDate && !!endDate && now >= startDate && now <= endDate;
    });

    if (liveProgram) {
      return liveProgram;
    }

    return programs.find((program) => {
      const startDate = this.getProgramDateTime(program.date, program.from_time, false);
      return !!startDate && startDate >= now;
    }) ?? null;
  }

  getNextProgramPrefix(event: EventDetailsModel): string {
    const nextProgram = this.getNextProgramInEvent(event);
    if (!nextProgram) {
      return 'Next program';
    }

    const status = this.getProgramStatus({
      ...nextProgram,
      eventTitle: event.title,
      groupTitle: '',
      year_count: event.year_count,
    });

    return status === 'live' ? 'Live now' : 'Next program';
  }

  getProgramScheduleSummary(program: ProgramDetailModel): string {
    const dateLabel = this.formatDate(program.date);
    const fromTime = this.formatTime12Hour(program.from_time);
    const toTime = this.formatTime12Hour(program.to_time);

    if (fromTime && toTime) {
      return `${dateLabel}, ${fromTime} - ${toTime}`;
    }

    if (fromTime) {
      return `${dateLabel}, ${fromTime}`;
    }

    return dateLabel;
  }

  getEventDescriptionPreview(description: string | undefined): string {
    if (!description) {
      return '';
    }

    const normalizedDescription = description.replace(/(?:\s*\.\.\.|\s*…)+\s*$/, '').trim();
    const maxLength = 90;

    if (normalizedDescription.length <= maxLength) {
      return normalizedDescription;
    }

    return `${normalizedDescription.slice(0, maxLength).trimEnd()}...`;
  }

  getGroupDescriptionPreview(description: string | undefined): string {
    if (!description) {
      return '';
    }

    const normalizedDescription = description.replace(/(?:\s*\.\.\.|\s*…)+\s*$/, '').trim();
    const maxLength = 90;

    if (normalizedDescription.length <= maxLength) {
      return normalizedDescription;
    }

    return `${normalizedDescription.slice(0, maxLength).trimEnd()}...`;
  }

  private resolveTemporalStatus(
    startDate: Date | null,
    endDate: Date | null
  ): 'live' | 'upcoming' | 'completed' {
    if (!startDate || !endDate) {
      return 'upcoming';
    }

    const now = new Date();
    if (now >= startDate && now <= endDate) {
      return 'live';
    }

    return now < startDate ? 'upcoming' : 'completed';
  }

  private getEventDateBoundary(dateValue: string | undefined, isEndDate: boolean): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const result = isEndDate
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day, 0, 0, 0, 0);

    return Number.isNaN(result.getTime()) ? null : result;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) return date;
    const d = new Date(year, month - 1, day);
    if (Number.isNaN(d.getTime())) return date;
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(d)
      .replace(/ /g, '-');
  }

  formatTime12Hour(time: string | undefined): string {
    if (!time) {
      return '';
    }

    const parsed = this.parseTimeToHoursMinutes(time);
    if (!parsed) {
      return time;
    }

    const [hours, minutes] = parsed;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date).toLowerCase();
  }

  private getProgramDateTime(
    dateValue: string | undefined,
    timeValue: string | undefined,
    isEndTime: boolean
  ): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const parsedTime = this.parseTimeToHoursMinutes(timeValue);
    const hours = parsedTime ? parsedTime[0] : isEndTime ? 23 : 0;
    const minutes = parsedTime ? parsedTime[1] : isEndTime ? 59 : 0;

    const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  private parseTimeToHoursMinutes(time: string | undefined): [number, number] | null {
    if (!time) {
      return null;
    }

    const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
      return null;
    }
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return [hours, minutes];
  }

  private getDateOnly(dateValue: string | undefined): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const result = new Date(year, month - 1, day, 0, 0, 0, 0);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  private parseDistanceToMeters(distance: number | string | undefined | null): number {
    if (distance === null || distance === undefined || distance === '') {
      return Number.POSITIVE_INFINITY;
    }

    if (typeof distance === 'number') {
      return Number.isFinite(distance) ? distance * 1000 : Number.POSITIVE_INFINITY;
    }

    const raw = distance.trim().toLowerCase();
    const parsed = Number.parseFloat(raw.replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(parsed)) {
      return Number.POSITIVE_INFINITY;
    }

    if (raw.includes('km')) {
      return parsed * 1000;
    }

    if (raw.includes('m')) {
      return parsed;
    }

    return parsed;
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
      width: '70vw',
      maxWidth: '90vw',
      height: '100vh',
      maxHeight: '100vh',
      data: event,
      autoFocus: false,
      panelClass: ['event-details-slide-dialog'],
      position: { top: '0', right: '0' }
    });
  }

  openGroupProfile(group: GroupDetailsModel) {
    this.dialog.open(GroupProfileDialogComponent, {
      width: '70vw',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      data: group,
      autoFocus: false,
      panelClass: ['event-details-slide-dialog'],
      position: { top: '0', right: '0' }
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

  getGroupAreaName(group: GroupDetailsModel): string {
    const areaName = group.locationName?.trim();
    if (!areaName || areaName.toLowerCase() === 'failed') {
      return 'Area unavailable';
    }

    return areaName;
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


  @ViewChild('tabGroup')
  tabGroup: any;

  scrollTabs(event: WheelEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.mat-mdc-tab-header')) {
      return;
    }

    const children = this.tabGroup?._tabHeader?._elementRef?.nativeElement?.children;
    if (!children || children.length < 3) {
      return;
    }

    const back = children[0] as HTMLElement;
    const forward = children[2] as HTMLElement;

    // Prefer horizontal touchpad swipe; keep vertical wheel as fallback.
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) {
      return;
    }

    event.preventDefault();
    if (delta > 0) {
      forward.click();
    } else {
      back.click();
    }
  }

}
