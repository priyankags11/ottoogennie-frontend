import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https://localhost:5092/api'; // your .NET API

  constructor(private http: HttpClient) { }

  createUser(data: any) : Observable<any> {
    return this.http.post(`${this.baseUrl}/user`, data);
  }

  createBooking(data: any) {
    return this.http.post(`${this.baseUrl}/booking`, data);
  }
}
