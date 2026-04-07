import { Component, OnInit, ViewEncapsulation, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupAdminModel, StateModel } from '../../models/home.model';
import { HomeService } from '../../services/home.service';

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
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-samiti-dialog.component.html',
  styleUrl: './create-samiti-dialog.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateSamitiDialogComponent implements OnInit {
  samitiForm!: FormGroup;

  states: StateModel[] = [];
  districts: any[] = [];
  areas: any[] = [];

  loadingStates = false;
  loadingDistricts = false;
  loadingAreas = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateSamitiDialogComponent>,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.samitiForm = this.fb.group({
      samitiName: ['', Validators.required],
      state: ['', Validators.required],
      district: [{ value: '', disabled: true }, Validators.required],
      area: [{ value: '', disabled: true }, Validators.required],
      location: ['', Validators.required],
      description: [''],
      since: [new Date().getFullYear(), Validators.required],
      groupContactNumbers: this.fb.array([this.fb.control('', Validators.required)]),
      admins: this.fb.array([this.createAdminFormGroup()])
    });

    this.loadStates();
  }

  private loadStates(): void {
    this.loadingStates = true;
    this.homeService.getStates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.states = data; this.loadingStates = false; },
        error: () => { this.loadingStates = false; }
      });
  }

  onStateChange(stateId: number): void {
    this.samitiForm.get('district')?.setValue('');
    this.samitiForm.get('district')?.disable();
    this.samitiForm.get('area')?.setValue('');
    this.samitiForm.get('area')?.disable();
    this.districts = [];
    this.areas = [];
    if (!stateId) return;

    this.loadingDistricts = true;
    this.homeService.getDistricts(stateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.districts = data;
          this.samitiForm.get('district')?.enable();
          this.loadingDistricts = false;
        },
        error: () => { this.loadingDistricts = false; }
      });
  }

  onDistrictChange(districtId: number): void {
    this.samitiForm.get('area')?.setValue('');
    this.samitiForm.get('area')?.disable();
    this.areas = [];
    if (!districtId) return;

    this.loadingAreas = true;
    this.homeService.getAreas(districtId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.areas = data;
          this.samitiForm.get('area')?.enable();
          this.loadingAreas = false;
        },
        error: () => { this.loadingAreas = false; }
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
