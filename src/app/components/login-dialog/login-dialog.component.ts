import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

const COOKIE_EMAIL_KEY = 'remember_email';
const COOKIE_DAYS = 30;

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    FormsModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginDialogComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  rememberMe = false;
  isForgotPassword = false;
  resetEmail = '';
  resetEmailSent = false;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private router: Router) {}

  ngOnInit(): void {
    const saved = this.getCookie(COOKIE_EMAIL_KEY);
    if (saved) {
      this.email = saved;
      this.rememberMe = true;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rememberMe) {
      this.setCookie(COOKIE_EMAIL_KEY, this.email, COOKIE_DAYS);
    } else {
      this.deleteCookie(COOKIE_EMAIL_KEY);
    }
    console.log('Login attempt:', { email: this.email, password: this.password, rememberMe: this.rememberMe });
    this.dialogRef.close(true);
    this.router.navigate(['/dashboard']);
  }

  onForgotPassword(): void {
    if (!this.resetEmail) return;
    // TODO: call actual password reset API
    console.log('Password reset requested for:', this.resetEmail);
    this.resetEmailSent = true;
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  }
}
