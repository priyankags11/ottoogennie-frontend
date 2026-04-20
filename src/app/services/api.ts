import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface BookingDetails {
  carModel: string;
  fuelType: string;
  packageName: string;
  price: number;
  slot?: string;
  address?: string;
  duration?: any;
  actualPrice?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = environment.apiUrl;

  private _bookingData: BookingDetails = {
    carModel: 'Maruti Swift', // Example initial data
    fuelType: 'Petrol',
    packageName: 'Comprehensive Service',
    price: 3999,
    duration: '8 Hrs Taken'
  };

  constructor(private http: HttpClient) { }

  createUser(data: any) : Observable<any> {
    return this.http.post(`${this.baseUrl}/user`, data);
  }

  createBooking(data: any) {
    return this.http.post(`${this.baseUrl}/api/Booking`, data);
  }

  get data() { return this._bookingData; }

  updateSlot(slot: string) { this._bookingData.slot = slot; }
  updateAddress(addr: string) { this._bookingData.address = addr; }

}
