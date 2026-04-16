import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent, CustomSnackBarData } from './custom-snackbar.component';

export type NotificationType = 'success' | 'error' | 'warn' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: NotificationType = 'info', duration = 4000) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type, duration } as CustomSnackBarData,
      duration: 0, // we handle dismiss manually for pause/resume
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar-panel'],
    });
  }

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  warn(message: string, duration = 4000) {
    this.show(message, 'warn', duration);
  }

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }
}
