import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { CreateSamitiDialogComponent } from '../../features/home/dialogs/create-samiti-dialog/create-samiti-dialog.component';
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
  
  private snackBar = inject(MatSnackBar);
  
  isPaletteOpen = false;
  isLoggedIn = false;
  
  userLocationName = this.locationService.userLocationName$;
  userLocationCords = this.locationService.userLocationCords$;

  constructor( public dialog: MatDialog, private router: Router ) {
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
      }
    });
  }

  onCreateSamiti() {
    this.dialog.open(CreateSamitiDialogComponent, {
      position: { right: '0', top: '0' },
      height: '100%',
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'slide-in-dialog',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'dark-backdrop',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms'
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log('Samiti created:', result);
        this.snackBar.open('"' + result.name + '" samiti created successfully!', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  onLogout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
  }
  
  toggleThemePalette() {
    this.isPaletteOpen = !this.isPaletteOpen;
  }
}
