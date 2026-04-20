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
  selectedPayment: 'cash' | 'upi' | '' = '';
  isProcessing = false;
  bookingConfirmed = false;
  bookingId = '';

  paymentOptions = [
    {
      id: 'cash',
      label: 'Cash on Delivery',
      desc: 'Pay after service is done',
      icon: '💵',
      badge: ''
    },
    {
      id: 'upi',
      label: 'UPI / Online',
      desc: 'via Zoho Billing — instant & secure',
      icon: '📱',
      badge: 'Recommended'
    }
  ];

  constructor(private api: Api, private router: Router) {
    this.booking = this.api.data;
  }

  get gst(): number {
    const price = this.booking?.price || 0;
    return Math.round(price * 0.18);
  }

  get total(): number {
    return (this.booking?.price || 0) + this.gst;
  }

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

    // Simulate API call
    setTimeout(() => {
      this.bookingId = 'RR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.isProcessing = false;
      this.bookingConfirmed = true;
    }, 1800);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
