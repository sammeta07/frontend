import { Component, Input, OnInit,inject,OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LocationService } from '../../shared/location.service';
import { HomeService } from '../../features/home/services/home.service';
import { ThemeService } from '../../shared/theme.service';
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
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private locationService = inject(LocationService);
  private homeService = inject(HomeService);
  public themeService = inject(ThemeService);
  
  isPaletteOpen = false;
  
  locationName = this.locationService.locationName$;
  locationCords = this.locationService.locationCords$;
  searchTerm: string = '';
  distanceOptions: number[] = [1, 2, 3, 4, 5, 10, 20];
  selectedDistance: number = 1;

  constructor( public dialog: MatDialog ) {
    console.log('HeaderComponent initialized. Current location:', this.locationCords(), 'Location name:', this.locationName());
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

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
  }
  
  toggleThemePalette() {
    this.isPaletteOpen = !this.isPaletteOpen;
  }
}
