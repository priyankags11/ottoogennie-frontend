import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
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
  statuses = ['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  expandedId: string | null = null;

  constructor(private router: Router, private http: HttpClient) { }

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
      ? `Welcome, ${this.session.name} 👋`
      : `Hi, ${this.session.name} 👋`;
  }

  get stats() {
    const all = this.bookings.length;
    const confirmed = this.bookings.filter(b => b.status === 'Confirmed').length;
    const completed = this.bookings.filter(b => b.status === 'Completed').length;
    const total = this.bookings.reduce((s: number, b: any) => s + (b.price || 0), 0);
    return { all, confirmed, completed, total };
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
        b.customer?.phone?.includes(q) ||
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
  }

  updateStatus(bookingId: string, newStatus: string) {
    this.http.patch(`${environment.apiUrl}/api/booking/${bookingId}/status`, { status: newStatus })
      .subscribe({
        next: () => {
          const b = this.bookings.find(x => x.id === bookingId);
          if (b) b.status = newStatus;
          this.applyFilters();
        },
        error: () => alert('Failed to update status.')
      });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Confirmed': 'status-confirmed',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || 'status-confirmed';
  }

  logout() {
    sessionStorage.removeItem('rr_session');
    this.router.navigate(['/']);
  }
}
