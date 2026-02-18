import { Component, Input, OnInit,inject,OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LocationService } from '../../location.service';
import { HomeService } from '../../features/home/services/home.service';


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
    MatInputModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private locationService = inject(LocationService);
  private homeService = inject(HomeService);
  locationName$ = this.locationService.locationName$;
  location$ = this.locationService.location$;
  searchTerm: string = '';
  

  constructor( public dialog: MatDialog ) {
    // this.locationService.locationName$.subscribe(locationName => {
    //   console.log('locationName$:', locationName);
    //   // Trigger change detection to update the UI with the new location
    // });
    //  this.locationService.location$.subscribe(location => {
    //   console.log('location$:', location);
    //   // Trigger change detection to update the UI with the new location
    // });
  }
  onSearchGroups(event: Event){
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    this.homeService.searchTerm$.next(this.searchTerm);
  }
  clearSearch(input: HTMLInputElement){
    input.value = '';
    this.searchTerm = '';
    this.homeService.searchTerm$.next(this.searchTerm);
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      autoFocus: false
    });
  }
}
