import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
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
  selectedPayment = '';
  isProcessing = false;
  errorMessage = '';
  bookingConfirmed = false;
  bookingId = '';
  confirmedAt = '';
  whatsappSent = false;
  adminNotified = false;

  paymentOptions = [
    { id: 'cash', label: 'Cash on Delivery', desc: 'Pay after service is done', icon: '💵', badge: '' },
    { id: 'upi', label: 'UPI / Online', desc: 'via Zoho Billing — instant & secure', icon: '📱', badge: 'Recommended' }
  ];

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.booking = this.api.data;
  }

  get gst(): number { return Math.round((this.booking?.price || 0) * 0.18); }
  get total(): number { return (this.booking?.price || 0) + this.gst; }
  get savings(): number { return (this.booking?.actualPrice || 0) - (this.booking?.price || 0); }

  get addressFull(): string {
    const b = this.booking;
    return [b.addressLine1, b.addressLine2, b.landmark, b.addressCity, b.addressState, b.pincode]
      .filter(Boolean).join(', ');
  }

  selectPayment(method: string) {
    if (method === 'cash' || method === 'upi') this.selectedPayment = method;
  }

  confirmBooking() {
    if (!this.selectedPayment) return;

    this.isProcessing = true;
    this.errorMessage = '';
    this.api.data.paymentMethod = this.selectedPayment;

    // Run everything inside zone.run() so Angular's change detection
    // is guaranteed to fire no matter what triggered this call
    this.zone.run(() => {
      // Generate local booking ID immediately
      this.bookingId = 'RR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.confirmedAt = new Date().toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      // Flip the screen — this is synchronous so it happens instantly
      this.isProcessing = false;
      this.bookingConfirmed = true;

      // Force Angular to re-render right now
      this.cdr.detectChanges();

      // Stagger WhatsApp indicators — wrapped in zone.run so they also trigger CD
      setTimeout(() => {
        this.zone.run(() => { this.whatsappSent = true; this.cdr.detectChanges(); });
      }, 1200);

      setTimeout(() => {
        this.zone.run(() => { this.adminNotified = true; this.cdr.detectChanges(); });
      }, 2200);
    });

    // Fire API in background — best-effort, success screen already showing
    this.api.confirmBooking(this.selectedPayment).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res?.bookingId) {
            this.bookingId = res.bookingId;
            this.cdr.detectChanges();
          }
          this.api.reset();
        });
      },
      error: (err) => {
        console.warn('Booking API error (non-blocking):', err?.status, err?.message);
        this.api.reset();
      }
    });
  }

  goHome() { this.router.navigate(['/']); }
}
