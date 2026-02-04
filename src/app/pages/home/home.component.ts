import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../../components/event-details-dialog/event-details-dialog.component';
import { GroupProfileDialogComponent } from '../../components/group-profile-dialog/group-profile-dialog.component';
import { JoinGroupDialogComponent } from '../../components/join-group-dialog/join-group-dialog.component';
import { HomeService } from './home.service';
import { enrichGroupData, getGroupLogoUrl, getYearLabel, sortEvents } from './home.utils';
import { SamitiGroup, SamitiEvent } from '../../models/samiti-group.model';

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
export class HomeComponent implements OnInit {
  private dialog = inject(MatDialog);
  private homeService = inject(HomeService);

  samitiGroups: SamitiGroup[] = [];
  
  // Expose utility functions to the template
  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  ngOnInit() {
    this.getGroupsAndEventsData();
  }

  getGroupsAndEventsData() {
    this.homeService.getGroupsAndEvents().subscribe((data: any[]) => {
      this.samitiGroups = data as SamitiGroup[];
      enrichGroupData(this.samitiGroups);
      sortEvents(this.samitiGroups);
    });
  }

  onCreateSamiti() {
    // TODO: Implement Create Samiti logic
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

  openMap(location: string) {
    if (location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  }

  openJoinGroupDialog(group: SamitiGroup) {
    this.dialog.open(JoinGroupDialogComponent, {
      width: '400px',
      data: group,
      autoFocus: false
    });
  }
}
