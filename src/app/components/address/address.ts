import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './address.html',
  styleUrls: ['./address.css']
})
export class Address {

  addressForm: FormGroup;
  isDetecting = false;
  gpsDetected = false;
  gpsError = '';

  savedAddresses = [
    {
      id: 1,
      tag: 'Home',
      icon: '🏠',
      line1: '42, 5th Cross, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    {
      id: 2,
      tag: 'Work',
      icon: '🏢',
      line1: '12, MG Road, Prestige Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  ];

  selectedSavedAddress: number | null = null;
  showManualForm = false;

  states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: Api,
    private ngZone: NgZone
  ) {
    this.addressForm = this.fb.group({
      line1: ['', [Validators.required, Validators.minLength(5)]],
      line2: [''],
      landmark: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]]
    });
  }

  get f() { return this.addressForm.controls; }

  isFieldInvalid(field: string): boolean {
    const c = this.addressForm.get(field);
    return !!(c?.touched && c?.invalid);
  }

  isFieldValid(field: string): boolean {
    const c = this.addressForm.get(field);
    return !!(c?.touched && c?.valid);
  }

  selectSavedAddress(addr: any) {
    this.selectedSavedAddress = addr.id;
    this.showManualForm = false;
    this.addressForm.patchValue({
      line1: addr.line1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode
    });
  }

  openManualForm() {
    this.selectedSavedAddress = null;
    this.showManualForm = true;
    this.addressForm.reset();
  }

  detectGPS() {
    this.isDetecting = true;
    this.gpsError = '';

    if (!navigator.geolocation) {
      this.gpsError = 'GPS is not supported by your browser.';
      this.isDetecting = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success — runs OUTSIDE Angular zone, so wrap in ngZone.run()
        this.ngZone.run(() => {
          // In production: call a reverse-geocoding API with
          // position.coords.latitude & position.coords.longitude here.
          // For now we patch with a simulated Bangalore address.
          this.addressForm.patchValue({
            line1: `GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001'
          });
          this.addressForm.markAllAsTouched();
          this.gpsDetected = true;
          this.isDetecting = false;
          this.showManualForm = true;
          this.selectedSavedAddress = null;
        });
      },
      (error) => {
        // Error — also runs OUTSIDE Angular zone
        this.ngZone.run(() => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.gpsError = 'Location access denied. Please allow location permission and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.gpsError = 'Location unavailable. Please enter your address manually.';
              break;
            case error.TIMEOUT:
              this.gpsError = 'Location request timed out. Please try again.';
              break;
            default:
              this.gpsError = 'Could not detect location. Please enter manually.';
          }
          this.isDetecting = false;
          this.showManualForm = true;
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  get canContinue(): boolean {
    if (this.selectedSavedAddress !== null) return true;
    return this.addressForm.valid;
  }

  proceed() {
    if (!this.canContinue) {
      this.addressForm.markAllAsTouched();
      return;
    }

    let addressData: any;

    if (this.selectedSavedAddress !== null) {
      const saved = this.savedAddresses.find(a => a.id === this.selectedSavedAddress);
      addressData = saved;
    } else {
      addressData = this.addressForm.value;
    }

    // Pass to API service if needed
    // this.api.updateAddress(addressData);

    this.router.navigate(['/booking-summary']);
  }
}
