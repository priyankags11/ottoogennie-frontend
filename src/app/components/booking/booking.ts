import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class Booking {

  successMessage = '';
  errorMessage = '';
  isLoading = false;
  showDropdown = false;

  bookingForm: FormGroup;

  cities: string[] = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Chandigarh',
    'Kochi', 'Coimbatore', 'Visakhapatnam', 'Vadodara', 'Patna'
  ];

  filteredCities: string[] = [...this.cities];

  serviceTypes = [
    { value: 'car', label: 'Car', icon: '🚗', desc: 'Sedan, SUV, Hatchback' },
    { value: 'bike', label: 'Bike', icon: '🏍️', desc: 'Sports, Cruiser, Commuter' }
  ];

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      serviceType: ['', Validators.required]
    });
  }

  get f() { return this.bookingForm.controls; }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.bookingForm.get(field);
    return !!(ctrl?.touched && ctrl?.invalid);
  }

  isFieldValid(field: string): boolean {
    const ctrl = this.bookingForm.get(field);
    return !!(ctrl?.touched && ctrl?.valid);
  }

  selectServiceType(value: string) {
    this.bookingForm.patchValue({ serviceType: value });
    this.bookingForm.get('serviceType')?.markAsTouched();
  }

  filterCities(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.toLowerCase().includes(value)
    );
    this.showDropdown = true;
  }

  selectCity(city: string) {
    this.bookingForm.patchValue({ city });
    this.bookingForm.get('city')?.markAsTouched();
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.city-dropdown-wrapper')) {
      this.showDropdown = false;
    }
  }

  submit() {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) return;
    this.isLoading = true;

    this.api.createBooking(this.bookingForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = `Booking initiated! Select your vehicle.`;
        this.router.navigate(['/select-vehicle']);
        this.errorMessage = '';
        this.bookingForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }
}


