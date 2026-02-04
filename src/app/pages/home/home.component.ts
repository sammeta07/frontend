import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../../components/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from '../../components/group-profile-dialog/group-profile-dialog.component';
import { SamitiService } from '../../services/samiti.service';
import { SamitiGroup, SamitiEvent } from '../../models/samiti.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private dialog = inject(MatDialog);
  private samitiService = inject(SamitiService);

  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];
  filteredSamitiGroups: (SamitiGroup & { events: SamitiEvent[] })[] = [];

  constructor() {
    this.initAvailableYears();
    this.fetchDataForYear(this.selectedYear);
  }

  initAvailableYears() {
    const current = new Date().getFullYear();
    this.availableYears = [
        current + 1,
        current,
        current - 1,
        current - 2,
        current - 3,
        current - 4
    ];
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.fetchDataForYear(year);
  }

  fetchDataForYear(year: number) {
    this.filteredSamitiGroups = this.samitiService.getGroupsForYear(year);
  }

  onCreateSamiti() {
    // Logic to create new samiti
  }

  openEventDetails(event: SamitiEvent) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '600px',
      data: event,
      autoFocus: false
    });
  }

  openGroupProfile(group: SamitiGroup) {
    this.dialog.open(GroupProfileDialogComponent, {
      width: '500px',
      data: group,
      autoFocus: false
    });
  }

  getGroupLogoUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  }

  getYearLabel(yearCount: number): string {
    if (!yearCount) return '';
    const j = yearCount % 10,
        k = yearCount % 100;
    if (j == 1 && k != 11) {
        return yearCount + "st Year";
    }
    if (j == 2 && k != 12) {
        return yearCount + "nd Year";
    }
    if (j == 3 && k != 13) {
        return yearCount + "rd Year";
    }
    return yearCount + "th Year";
  }

  // TrackBy functions for optimization
  trackByGroupId(index: number, group: SamitiGroup): string {
    return group.name; 
  }

  trackByEventId(index: number, event: SamitiEvent): number {
    return event.id;
  }
}
