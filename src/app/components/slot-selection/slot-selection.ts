import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Api, BookingDetails } from '../../services/api';
import { environment } from '../../../environments/environment';


interface SlotItem {
  time: string;
  label: string;
  available: boolean;
  booked: number;
  blocked: boolean;
}

@Component({
  selector: 'app-slot-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slot-selection.html',
  styleUrls: ['./slot-selection.css']
})
export class SlotSelection {

  morningSlots: SlotItem[] = [];
  eveningSlots: SlotItem[] = [];
  loadingSlots = false;
  slotsError = '';

  selectedSlot = '';
  booking: BookingDetails;

  today = new Date();
  selectedDate: Date;
  weekDays: Date[] = [];

  constructor(
    private api: Api,
    private router: Router,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.booking = this.api.data;
    this.selectedDate = new Date(this.today);
    this.buildWeekDays();
    this.loadSlots();   // ← load for today on init
  }

  buildWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.today);
      d.setDate(this.today.getDate() + i);
      this.weekDays.push(d);
    }
  }

  // ── Format date as YYYY-MM-DD for API ──
  private toDateString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  // ── Format time label: "09:00 AM" → "9:00 AM" ──
  private formatLabel(time: string): string {
    const [h, rest] = time.split(':');
    const hour = parseInt(h);
    const suffix = rest.split(' ')[1];
    return `${hour}:${rest.split(' ')[0]} ${suffix}`;
  }

  // ── Load slots from backend ──
  loadSlots() {
    this.loadingSlots = true;
    this.slotsError = '';
    this.morningSlots = [];
    this.eveningSlots = [];
    this.selectedSlot = '';

    const dateStr = this.toDateString(this.selectedDate);

    this.http.get<any>(`${environment.apiUrl}/api/slot/available?date=${dateStr}`)
      .subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.morningSlots = (res.morning || []).map((s: any) => ({
              time: s.time,
              label: this.formatLabel(s.time),
              available: s.available,
              booked: s.booked,
              blocked: s.blocked
            }));
            this.eveningSlots = (res.evening || []).map((s: any) => ({
              time: s.time,
              label: this.formatLabel(s.time),
              available: s.available,
              booked: s.booked,
              blocked: s.blocked
            }));
            this.loadingSlots = false;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            // Fallback: show all slots as available if API fails
            this.slotsError = 'Could not load live slot availability. Showing default slots.';
            this.morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']
              .map(t => ({ time: t, label: this.formatLabel(t), available: true, booked: 0, blocked: false }));
            this.eveningSlots = ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
              .map(t => ({ time: t, label: this.formatLabel(t), available: true, booked: 0, blocked: false }));
            this.loadingSlots = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  selectDate(d: Date) {
    this.selectedDate = d;
    this.loadSlots();   // ← reload slots for newly selected date
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
  }

  getDayLabel(d: Date): string {
    if (this.isSameDay(d, this.today)) return 'Today';
    const tomorrow = new Date(this.today);
    tomorrow.setDate(this.today.getDate() + 1);
    if (this.isSameDay(d, tomorrow)) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short' });
  }

  getDateNum(d: Date): string { return d.getDate().toString(); }
  getMonthShort(d: Date): string { return d.toLocaleDateString('en-IN', { month: 'short' }); }

  selectSlot(slot: SlotItem) {
    if (!slot.available) return;
    this.selectedSlot = slot.time;
    const dateStr = this.toDateString(this.selectedDate);
    const dateLabel = this.selectedDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    this.api.updateSlot(dateLabel, slot.time);
  }

  get formattedDate(): string {
    return this.selectedDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  navToAddress() { this.router.navigate(['/address']); }
}
