import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LocationService } from '../../services/location.service';

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
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private dialog = inject(MatDialog);
  private locationService = inject(LocationService);

  currentLocationLabel$ = this.locationService.locationLabel$;
  isLocationLoading$ = this.locationService.isLoading$;

  ngOnInit() {
    this.locationService.initializeLocation();
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      autoFocus: false
    });
  }
}
