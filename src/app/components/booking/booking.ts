import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

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

  bookingForm: FormGroup;

  constructor(private fb: FormBuilder, private api: Api) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$')
      ]],
      city: ['', Validators.required],
      serviceType: ['', Validators.required]
    });
  }

  submit() {
    if (this.bookingForm.invalid) return;

    this.isLoading = true;

    this.api.createBooking(this.bookingForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = `${res.service} booked successfully 🚗`;
        this.errorMessage = '';
        this.bookingForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Something went wrong ❌';
        console.log(err);
        this.isLoading = false;
      }
    });
  }
}
