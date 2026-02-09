import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { groupDetailsModel } from '../../models/home.model';

@Component({
  selector: 'app-join-group-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './join-group-dialog.component.html',
  styleUrl: './join-group-dialog.component.css'
})
export class JoinGroupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<JoinGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: groupDetailsModel
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // TODO: Implement join logic
    console.log('Join request for:', this.data.name);
    this.dialogRef.close(true);
  }
}
