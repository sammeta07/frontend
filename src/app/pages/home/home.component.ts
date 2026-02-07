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
import { CreateSamitiDialogComponent } from '../../components/create-samiti-dialog/create-samiti-dialog.component';
import { HomeService } from './home.service';
import { calculateStatus,getGroupLogoUrl, getYearLabel, sortEvents } from './home.utils';
import { groupDetailsModel, eventDetailsModel } from './home.model';

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

  samitiGroups: groupDetailsModel[] = [];
  private allGroups: groupDetailsModel[] = [];
  
  // Expose utility functions to the template
  getGroupLogoUrl = getGroupLogoUrl;
  getYearLabel = getYearLabel;

  ngOnInit() {
    this.getGroupsAndEventsData();
  }

  getGroupsAndEventsData() {
    this.homeService.getGroupsAndEvents().subscribe((data: any[]) => {
      this.samitiGroups = data as groupDetailsModel[];
      this.allGroups = [...this.samitiGroups]; // Store original list
      calculateStatus(this.samitiGroups);
      // enrichGroupData(this.samitiGroups);
      sortEvents(this.samitiGroups);
    });
  }

  onSearchGroups(event: any) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    if (!searchTerm) {
      // Reset to all groups if search is empty
      this.samitiGroups = [...this.allGroups];
    } else {
      // Filter groups by name
      this.samitiGroups = this.allGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm)
      );
    }
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
}
