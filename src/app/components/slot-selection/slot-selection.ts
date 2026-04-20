import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api, BookingDetails } from '../../services/api';

@Component({
  selector: 'app-slot-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slot-selection.html',
  styleUrls: ['./slot-selection.css']
})
export class SlotSelection {

  morningSlots = [
    { time: '09:00 AM', label: '9:00 AM', available: true },
    { time: '10:00 AM', label: '10:00 AM', available: true },
    { time: '11:00 AM', label: '11:00 AM', available: true },
    { time: '12:00 PM', label: '12:00 PM', available: false },
    { time: '01:00 PM', label: '1:00 PM', available: true }
  ];

  eveningSlots = [
    { time: '02:00 PM', label: '2:00 PM', available: true },
    { time: '03:00 PM', label: '3:00 PM', available: true },
    { time: '04:00 PM', label: '4:00 PM', available: true },
    { time: '05:00 PM', label: '5:00 PM', available: false },
    { time: '06:00 PM', label: '6:00 PM', available: true }
  ];

  selectedSlot = '';
  booking: BookingDetails;

  today = new Date();
  selectedDate: Date;
  weekDays: Date[] = [];

  constructor(private api: Api, private router: Router) {
    this.booking = this.api.data;
    this.selectedDate = new Date(this.today);
    this.buildWeekDays();
  }

  buildWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.today);
      d.setDate(this.today.getDate() + i);
      this.weekDays.push(d);
    }
  }

  selectDate(d: Date) {
    this.selectedDate = d;
    this.selectedSlot = '';
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

  selectSlot(slot: any) {
    if (!slot.available) return;
    this.selectedSlot = slot.time;

    // ✅ Save date + time to shared API state
    const dateStr = this.selectedDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    this.api.updateSlot(dateStr, slot.time);
  }

  get formattedDate(): string {
    return this.selectedDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  navToAddress() {
    this.router.navigate(['/address']);
  }
}
