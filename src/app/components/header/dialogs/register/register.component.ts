import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RegisterService } from './register.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RegisterDialogComponent {
  name = '';
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;

  private notify = inject(NotificationService);

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private registerService: RegisterService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.registerService.register({
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      password: this.password,
      type: 'PUBLIC',
    }).subscribe({
      next: (result) => {
        this.notify.success('Registration successful!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get isFormValid(): boolean {
    return !!this.name && !!this.email && !!this.mobile && !!this.password && !!this.confirmPassword && this.passwordsMatch;
  }
}
