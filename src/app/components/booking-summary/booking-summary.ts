import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, BookingDetails } from '../../services/api';


@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.css'],
  standalone: true,
  imports: []
})
export class BookingSummary {
  // Access the data stored in your shared API service

  currentDate = new Date().toLocaleDateString();
  booking: BookingDetails;
  constructor(private api: Api, private router: Router) {
    this.booking = this.api.data;
  }

  changeDetail(route: string) {
    // Allows client to navigate back to edit car or slots
    this.router.navigate([route]);
  }

  confirmBooking() {
    alert('Booking Confirmed! Integrating with Zoho Billing...');
    // Here you would call your .NET API to save to SQL
  }
}
