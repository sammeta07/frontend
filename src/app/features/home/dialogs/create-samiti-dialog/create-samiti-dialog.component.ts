import { Component, OnInit, ViewEncapsulation, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupAdminModel, StateModel, CreateSamitiModel } from '../../models/home.model';
import { HomeService } from '../../services/home.service';
import { LocationService } from '../../../../shared/location.service';

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

  states = signal<StateModel[]>([]);
  districts = signal<any[]>([]);

  loadingStates = signal(false);
  loadingDistricts = signal(false);
  submitting = signal(false);

  private destroyRef = inject(DestroyRef);
  private locationService = inject(LocationService);

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
      area: ['', Validators.required],
      description: [''],
      since: [new Date().getFullYear(), Validators.required],
      groupContactNumbers: this.fb.array([this.fb.control('', Validators.required)]),
      admins: this.fb.array([this.createAdminFormGroup()])
    });

    this.loadStates();
  }

  private loadStates(): void {
    this.loadingStates.set(true);
    this.homeService.getStates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.states.set(data); this.loadingStates.set(false); },
        error: () => { this.loadingStates.set(false); }
      });
  }

  onStateChange(stateId: number): void {
    this.samitiForm.get('district')?.setValue('');
    this.samitiForm.get('district')?.disable();
    this.districts.set([]);
    if (!stateId) return;

    this.loadingDistricts.set(true);
    this.homeService.getDistricts(stateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.districts.set(data);
          this.samitiForm.get('district')?.enable();
          this.loadingDistricts.set(false);
        },
        error: () => { this.loadingDistricts.set(false); }
      });
  }

  onDistrictChange(_districtId: number): void {
    // District selected – no further cascade needed
  }

  get groupContactNumbers(): FormArray {
    return this.samitiForm.get('groupContactNumbers') as FormArray;
  }

  get admins(): FormArray {
    return this.samitiForm.get('admins') as FormArray;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      const errors = group.get('confirmPassword')?.errors;
      if (errors?.['passwordMismatch']) {
        delete errors['passwordMismatch'];
        group.get('confirmPassword')?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }

  createAdminFormGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
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

  async onSubmit(): Promise<void> {
    if (this.samitiForm.valid && !this.submitting()) {
      this.submitting.set(true);
      const formValue = this.samitiForm.value;
      let locationCords: { lat: number; long: number } | null = null;
      try {
        locationCords = await this.locationService.getHighAccuracyLocation();
      } catch {
        locationCords = this.locationService.userLocationCords$();
      }
      const payload: CreateSamitiModel = {
        name: formValue.samitiName,
        area: formValue.area,
        description: formValue.description,
        since: formValue.since,
        stateId: formValue.state || null,
        districtId: this.samitiForm.get('district')?.value || null,
        locationCords,
        groupContactNumbers: formValue.groupContactNumbers.filter((num: string) => num.trim() !== ''),
        admins: formValue.admins.map(({ email, contactNumber, password }: GroupAdminModel) => ({ email, contactNumber, password })),
      };
      this.homeService.createSamiti(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.submitting.set(false);
            this.dialogRef.close(res);
          },
          error: () => {
            this.submitting.set(false);
          }
        });
    }
  }
}
