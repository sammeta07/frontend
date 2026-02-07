import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GroupAdmin } from '../../pages/home/home.model';

@Component({
  selector: 'app-create-samiti-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './create-samiti-dialog.component.html',
  styleUrl: './create-samiti-dialog.component.css'
})
export class CreateSamitiDialogComponent implements OnInit {
  samitiForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateSamitiDialogComponent>
  ) {}

  ngOnInit(): void {
    this.samitiForm = this.fb.group({
      samitiName: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      since: [new Date().getFullYear(), Validators.required],
      groupContactNumbers: this.fb.array([this.fb.control('', Validators.required)]),
      admins: this.fb.array([this.createAdminFormGroup()])
    });
  }

  get groupContactNumbers(): FormArray {
    return this.samitiForm.get('groupContactNumbers') as FormArray;
  }

  get admins(): FormArray {
    return this.samitiForm.get('admins') as FormArray;
  }

  createAdminFormGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  addContactNumber(): void {
    this.groupContactNumbers.push(this.fb.control('', Validators.required));
  }

  removeContactNumber(index: number): void {
    if (this.groupContactNumbers.length > 1) {
      this.groupContactNumbers.removeAt(index);
    }
  }

  addAdmin(): void {
    this.admins.push(this.createAdminFormGroup());
  }

  removeAdmin(index: number): void {
    if (this.admins.length > 1) {
      this.admins.removeAt(index);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.samitiForm.valid) {
      const formValue = this.samitiForm.value;
      const newSamiti = {
        name: formValue.samitiName,
        location: formValue.location,
        description: formValue.description,
        since: formValue.since,
        groupContactNumbers: formValue.groupContactNumbers.filter((num: string) => num.trim() !== ''),
        admins: formValue.admins,
        events: []
      };
      this.dialogRef.close(newSamiti);
    }
  }
}
