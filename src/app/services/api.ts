import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


/* ── Full booking state object shared across all steps ── */
export interface BookingDetails {
  // Step 1 — user details
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  serviceType: string;   // 'car' | 'bike'

  // Step 2–3 — vehicle
  fuelType: string;
  brand: string;
  carModel: string;

  // Step 4 — package
  packageName: string;
  price: number;
  actualPrice: number;
  duration: string;

  // Step 5 — slot
  slotDate: string;
  slotTime: string;   // kept as 'slot' alias for slot-selection component
  slot: string;   // same value — legacy alias

  // Step 6 — address
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressCity: string;
  addressState: string;
  pincode: string;

  // Step 7 — payment
  paymentMethod: string;   // 'cash' | 'upi'
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class Api {

  private baseUrl = environment.apiUrl;   // set in environment.ts

  /* Shared state — survives navigation between steps */
  data: BookingDetails = this.emptyBooking();

  constructor(private http: HttpClient) { }

  /* ── Called from booking.ts after form submit ── */
  createBooking(formValue: any): Observable<any> {
    // Merge form values into shared state
    this.data.name = formValue.name;
    this.data.phoneNumber = formValue.phoneNumber;
    this.data.email = formValue.email;
    this.data.city = formValue.city;
    this.data.serviceType = formValue.serviceType;
    return this.http.post(`${this.baseUrl}/api/booking`, this.data);
  }

  /* ── Called from select-vehicle.ts ── */
  updateVehicle(fuelType: string, brand: string, carModel: string) {
    this.data.fuelType = fuelType;
    this.data.brand = brand;
    this.data.carModel = carModel;
  }

  /* ── Called from select-package.ts ── */
  updatePackage(pkg: {
    name: string; price: number; actualPrice: number; duration: string;
  }) {
    this.data.packageName = pkg.name;
    this.data.price = pkg.price;
    this.data.actualPrice = pkg.actualPrice;
    this.data.duration = pkg.duration;
  }

  /* ── Called from slot-selection.ts ── */
  updateSlot(date: string, time: string) {
    this.data.slotDate = date;
    this.data.slotTime = time;
    this.data.slot = `${date} ${time}`;
  }

  /* ── Called from address.ts ── */
  updateAddress(addr: {
    line1: string; line2: string; landmark: string;
    city: string; state: string; pincode: string;
  }) {
    this.data.addressLine1 = addr.line1;
    this.data.addressLine2 = addr.line2;
    this.data.landmark = addr.landmark;
    this.data.addressCity = addr.city;
    this.data.addressState = addr.state;
    this.data.pincode = addr.pincode;
  }

  /* ── Called from booking-summary.ts on final confirm ── */
  confirmBooking(paymentMethod: string): Observable<any> {
    this.data.paymentMethod = paymentMethod;
    return this.http.post(`${this.baseUrl}/api/booking`, this.data);
  }

  /* ── Reset after booking is complete ── */
  reset() {
    this.data = this.emptyBooking();
  }

  private emptyBooking(): BookingDetails {
    return {
      name: '', phoneNumber: '', email: '', city: '', serviceType: '',
      fuelType: '', brand: '', carModel: '',
      packageName: '', price: 0, actualPrice: 0, duration: '',
      slotDate: '', slotTime: '', slot: '',
      addressLine1: '', addressLine2: '', landmark: '',
      addressCity: '', addressState: '', pincode: '',
      paymentMethod: ''
    };
  }
}
