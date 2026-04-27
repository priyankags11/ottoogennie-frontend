import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './review.html',
  styleUrls: ['./review.css']
})
export class Review implements OnInit {

  bookingId = '';
  rating = 0;           // pre-filled from query param
  hoveredStar = 0;
  comment = '';

  isSubmitting = false;
  submitted = false;
  errorMsg = '';

  booking: any = null;
  loadingBooking = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'] || '';
      const r = parseInt(params['rating'] || '0');
      this.rating = r >= 1 && r <= 5 ? r : 0;

      if (this.bookingId) {
        this.loadBooking();
      } else {
        this.loadingBooking = false;
        this.errorMsg = 'Invalid review link.';
      }
    });
  }

  loadBooking() {
    this.http.get<any>(`${environment.apiUrl}/api/booking/${this.bookingId}`)
      .subscribe({
        next: (b) => {
          this.zone.run(() => {
            this.booking = b;
            this.loadingBooking = false;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.loadingBooking = false;
            this.errorMsg = 'Booking not found.';
            this.cdr.detectChanges();
          });
        }
      });
  }

  setRating(r: number) { this.rating = r; }
  hoverStar(r: number) { this.hoveredStar = r; }
  clearHover() { this.hoveredStar = 0; }

  getStarClass(index: number): string {
    const active = this.hoveredStar || this.rating;
    return index <= active ? 'star filled' : 'star';
  }

  get ratingLabel(): string {
    const labels: Record<number, string> = {
      1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent!'
    };
    return labels[this.hoveredStar || this.rating] || '';
  }

  submitReview() {
    if (!this.rating) { this.errorMsg = 'Please select a star rating.'; return; }
    if (!this.bookingId) return;

    this.isSubmitting = true;
    this.errorMsg = '';

    this.http.post<any>(
      `${environment.apiUrl}/api/booking/${this.bookingId}/review`,
      { rating: this.rating, comment: this.comment.trim() || null }
    ).subscribe({
      next: () => {
        this.zone.run(() => {
          this.isSubmitting = false;
          this.submitted = true;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isSubmitting = false;
          this.errorMsg = err?.error?.message || 'Could not submit review. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }
}
