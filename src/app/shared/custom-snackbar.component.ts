import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface CustomSnackBarData {
  message: string;
  type: 'success' | 'error' | 'warn' | 'info';
  duration: number;
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-snackbar" [class]="'snackbar-' + data.type">
      <div class="snackbar-content">
        <span class="snackbar-icon">{{ icon }}</span>
        <span class="snackbar-message">{{ data.message }}</span>
        <button class="snackbar-close" (click)="dismiss()">✕</button>
      </div>
      <div class="snackbar-progress-track">
        <div
          class="snackbar-progress-bar"
          [class]="'progress-' + data.type"
          [style.animationDuration.ms]="data.duration"
          [style.animationPlayState]="paused ? 'paused' : 'running'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .custom-snackbar {
      border-radius: 0;
      overflow: hidden;
      min-width: 280px;
      max-width: 420px;
    }

    .snackbar-content {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
    }

    .snackbar-icon { font-size: 18px; flex-shrink: 0; }

    .snackbar-message { flex: 1; line-height: 1.4; }

    .snackbar-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.75);
      font-size: 16px;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .snackbar-close:hover {
      color: #fff;
      background: rgba(255,255,255,0.15);
    }

    .snackbar-progress-track {
      height: 3px;
      background: rgba(255,255,255,0.2);
      width: 100%;
    }

    .snackbar-progress-bar {
      height: 100%;
      width: 100%;
      transform-origin: left;
      animation: progress-shrink linear forwards;
    }

    @keyframes progress-shrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }

    /* Type colors */
    .snackbar-success { background: #2e7d32; }
    .snackbar-error   { background: #c62828; }
    .snackbar-warn    { background: #e65100; }
    .snackbar-info    { background: #0277bd; }

    .progress-success { background: #81c784; }
    .progress-error   { background: #ef9a9a; }
    .progress-warn    { background: #ffcc80; }
    .progress-info    { background: #81d4fa; }
  `]
})
export class CustomSnackbarComponent implements OnInit, OnDestroy {
  data = inject<CustomSnackBarData>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject(MatSnackBarRef);

  paused = false;
  private elapsed = 0;
  private remaining = 0;
  private lastTick = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;

  get icon(): string {
    switch (this.data.type) {
      case 'success': return '✓';
      case 'error':   return '✗';
      case 'warn':    return '⚠';
      case 'info':    return 'ℹ';
    }
  }

  ngOnInit() {
    this.remaining = this.data.duration;
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.paused = true;
    this.elapsed += Date.now() - this.lastTick;
    this.remaining = this.data.duration - this.elapsed;
    this.clearTimer();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.paused = false;
    this.startTimer();
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }

  private startTimer() {
    this.lastTick = Date.now();
    this.timerId = setTimeout(() => this.dismiss(), this.remaining);
  }

  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
