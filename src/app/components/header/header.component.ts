import { Component, Input, OnInit,inject,OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LocationService } from '../../shared/location.service';
import { HomeService } from '../../features/home/services/home.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private locationService = inject(LocationService);
  private homeService = inject(HomeService);
  locationName = this.locationService.locationName$;
  location = this.locationService.location$;
  searchTerm: string = '';
  distanceOptions: number[] = [50, 100, 200, 500];
  selectedDistance: number = 50;

  constructor( public dialog: MatDialog ) {
    console.log('HeaderComponent initialized. Current location:', this.location(), 'Location name:', this.locationName());
  }
  onDistanceChange(distance: number) {
    this.selectedDistance = distance;
    this.homeService.selectedDistance.set(this.selectedDistance);
  }
  onSearchGroups(event: Event){
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    this.homeService.searchTerm.set(this.searchTerm);
  }
  clearSearch(input: HTMLInputElement){
    input.value = '';
    this.searchTerm = '';
    this.homeService.searchTerm.set(this.searchTerm);
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      autoFocus: false
    });
  }
}
