import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api, BookingDetails } from '../../services/api';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.css']
})
export class BookingSummary {

  booking: BookingDetails;
  selectedPayment: string = '';
  isProcessing = false;
  bookingConfirmed = false;
  bookingId = '';
  errorMessage = '';

  paymentOptions = [
    {
      id: 'cash', label: 'Cash on Delivery',
      desc: 'Pay after service is done', icon: '💵', badge: ''
    },
    {
      id: 'upi', label: 'UPI / Online',
      desc: 'via Zoho Billing — instant & secure', icon: '📱', badge: 'Recommended'
    }
  ];

  constructor(private api: Api, private router: Router) {
    this.booking = this.api.data;
  }

  get gst(): number { return Math.round((this.booking?.price || 0) * 0.18); }
  get total(): number { return (this.booking?.price || 0) + this.gst; }
  get savings(): number {
    return (this.booking?.actualPrice || 0) - (this.booking?.price || 0);
  }

  selectPayment(method: string) {
    if (method === 'cash' || method === 'upi') {
      this.selectedPayment = method;
    }
  }

  confirmBooking() {
    if (!this.selectedPayment) return;

    this.isProcessing = true;
    this.errorMessage = '';

    // ✅ Single API call — sends EVERYTHING to backend, backend saves + sends WhatsApp
    this.api.confirmBooking(this.selectedPayment).subscribe({
      next: (res: any) => {
        this.bookingId = res.bookingId;
        this.isProcessing = false;
        this.bookingConfirmed = true;
        this.api.reset();   // clear shared state after success
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = 'Something went wrong. Please try again.';
        console.error('Booking error:', err);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
