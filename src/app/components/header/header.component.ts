import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginDialogComponent } from './dialogs/login/login.component';
import { RegisterDialogComponent } from './dialogs/register/register.component';
import { LoginService } from './dialogs/login/login.service';

import { LocationService } from '../../shared/location.service';
import { ThemeService } from '../../shared/theme.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private locationService = inject(LocationService);
  public themeService = inject(ThemeService);
  private loginService = inject(LoginService);
  
  private snackBar = inject(MatSnackBar);
  
  isPaletteOpen = false;
  isLoggedIn = false;
  
  userLocationName = this.locationService.userLocationName$;
  userLocationCords = this.locationService.userLocationCords$;

  constructor( public dialog: MatDialog, private router: Router ) {
    this.isLoggedIn = this.loginService.isLoggedIn();
  }
  openRegisterDialog() {
    this.dialog.open(RegisterDialogComponent, {
      width: '400px',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'dark-backdrop'
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'dark-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.isLoggedIn = true;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onLogout(): void {
    this.loginService.clearUserData();
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
  }
  
  toggleThemePalette() {
    this.isPaletteOpen = !this.isPaletteOpen;
  }
}
