import { Component, Input, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LocationService } from '../../location.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private locationService = inject(LocationService);
  locationName$ = this.locationService.locationName$;

  constructor( public dialog: MatDialog ) {
    this.locationService.locationName$.subscribe(location => {
      console.log('User location updated:', location);
      // Trigger change detection to update the UI with the new location
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      autoFocus: false
    });
  }
}
