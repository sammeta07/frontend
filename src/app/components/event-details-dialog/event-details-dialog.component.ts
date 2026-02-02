import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <div class="meta-info">
        <span class="status-badge" [attr.data-status]="data.status">
          {{ data.status === 'inProgress' ? 'In Progress' : (data.status | titlecase) }}
        </span>
        <span class="date-range">
          {{ data.start_date | date:'mediumDate' }} - {{ data.end_date | date:'mediumDate' }}
        </span>
      </div>

      <div class="details-section">
        <h3>Description</h3>
        <p>
          This is the detailed view for <strong>{{ data.title }}</strong>. 
          Here you can display the full description, venue details, guest list, and budget breakdown.
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .meta-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .status-badge[data-status="inProgress"] { background: #e3f2fd; color: #1565c0; }
    .status-badge[data-status="upcoming"] { background: #fff3e0; color: #ef6c00; }
    .status-badge[data-status="completed"] { background: #e8f5e9; color: #2e7d32; }
    
    .date-range {
      color: #757575;
      font-size: 0.9rem;
    }
    .details-section h3 {
      margin-bottom: 8px;
      color: #424242;
    }
    .details-section p {
        line-height: 1.6;
        color: #616161;
    }
  `]
})
export class EventDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
