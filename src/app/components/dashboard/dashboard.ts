import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  session: any = null;
  isAdmin = false;
  bookings: any[] = [];
  filtered: any[] = [];

  searchTerm = '';
  statusFilter = 'All';

  // Exact status values that match the backend — no typos
  readonly statuses = ['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  expandedId: string | null = null;
  updatingId: string | null = null;   // shows spinner on the updating card
  updateError: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const raw = sessionStorage.getItem('rr_session');
    if (!raw) { this.router.navigate(['/profile']); return; }

    this.session = JSON.parse(raw);
    this.isAdmin = this.session.role === 'admin';
    this.bookings = this.session.bookings || [];
    this.applyFilters();
  }

  get greeting(): string {
    return this.isAdmin
      ? `Welcome, ${this.session.name}`
      : `Hi, ${this.session.name}`;
  }

  get stats() {
    const all = this.bookings.length;
    const confirmed = this.bookings.filter(b => b.status === 'Confirmed').length;
    const inProg = this.bookings.filter(b => b.status === 'In Progress').length;
    const completed = this.bookings.filter(b => b.status === 'Completed').length;
    const revenue = this.bookings
      .filter(b => b.status === 'Completed')
      .reduce((s: number, b: any) => s + (b.price || 0), 0);

    // Average rating across reviewed bookings
    const reviewed = this.bookings.filter(b => b.review?.rating);
    const avgRating = reviewed.length
      ? (reviewed.reduce((s: number, b: any) => s + b.review.rating, 0) / reviewed.length).toFixed(1)
      : null;

    return { all, confirmed, inProg, completed, revenue, avgRating, reviewCount: reviewed.length };
  }

  applyFilters() {
    let list = [...this.bookings];

    if (this.statusFilter !== 'All') {
      list = list.filter(b => b.status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(b =>
        b.carModel?.toLowerCase().includes(q) ||
        b.brand?.toLowerCase().includes(q) ||
        b.packageName?.toLowerCase().includes(q) ||
        b.customer?.name?.toLowerCase().includes(q) ||
        b.customer?.phoneNumber?.includes(q) ||
        b.id?.toLowerCase().includes(q)
      );
    }

    this.filtered = list;
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  setStatusFilter(s: string) {
    this.statusFilter = s;
    this.applyFilters();
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
    this.updateError = null;
  }

  // ── FIX: update status correctly ──────────────────────────────
  // Bug was: [ngClass]="getStatusClass(s)" on the button itself applied
  // badge colour classes to the button, making "In Progress" look like
  // "Completed". Fix: use separate CSS classes for buttons vs badges.
  updateStatus(bookingId: string, newStatus: string) {
    if (this.updatingId === bookingId) return;   // prevent double click

    this.updatingId = bookingId;
    this.updateError = null;

    this.http.patch<any>(
      `${environment.apiUrl}/api/booking/${bookingId}/status`,
      { status: newStatus }
    ).subscribe({
      next: (res) => {
        this.zone.run(() => {
          // Update the booking in both arrays so view reflects immediately
          const inAll = this.bookings.find(x => x.id === bookingId);
          if (inAll) inAll.status = res.status;    // use server-returned status

          const inFiltered = this.filtered.find(x => x.id === bookingId);
          if (inFiltered) inFiltered.status = res.status;

          this.updatingId = null;
          this.applyFilters();   // re-filter in case status filter is active
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.updatingId = null;
          this.updateError = bookingId;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // ── Status badge class (for the badge chip only) ──────────────
  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'Confirmed': 'badge-confirmed',
      'In Progress': 'badge-progress',
      'Completed': 'badge-completed',
      'Cancelled': 'badge-cancelled',
      'Payment Pending': 'badge-pending',
      'Payment Failed': 'badge-failed'
    };
    return map[status] || 'badge-confirmed';
  }

  // ── Status button class (for the action buttons — SEPARATE from badge) ──
  getStatusBtnClass(status: string): string {
    const map: Record<string, string> = {
      'Confirmed': 'btn-set-confirmed',
      'In Progress': 'btn-set-progress',
      'Completed': 'btn-set-completed',
      'Cancelled': 'btn-set-cancelled'
    };
    return map[status] || '';
  }

  // ── Render stars ──────────────────────────────────────────────
  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  logout() {
    sessionStorage.removeItem('rr_session');
    this.router.navigate(['/']);
  }
}
