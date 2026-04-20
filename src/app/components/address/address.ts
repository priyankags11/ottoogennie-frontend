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
    { id: 1, tag: 'Home', icon: '🏠', line1: '42, 5th Cross, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038' },
    { id: 2, tag: 'Work', icon: '🏢', line1: '12, MG Road, Prestige Tech Park', city: 'Bangalore', state: 'Karnataka', pincode: '560001' }
  ];

  selectedSavedAddress: number | null = null;
  showManualForm = false;

  states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
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
      line1: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode
    });
  }

  openManualForm() {
    this.selectedSavedAddress = null;
    this.showManualForm = true;
    this.addressForm.reset();
  }

  skipToManual() {
    this.isDetecting = false;
    this.gpsDetected = false;
    this.gpsError = '';
    this.showManualForm = true;
    this.addressForm.reset();
  }

  detectGPS() {
    if (!navigator.geolocation) {
      this.gpsError = 'Geolocation is not supported by your browser.';
      this.showManualForm = true;
      return;
    }

    this.isDetecting = true;
    this.gpsDetected = false;
    this.gpsError = '';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        // Open form immediately with coords — don't wait for Nominatim
        this.ngZone.run(() => {
          this.addressForm.patchValue({ line1: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          this.isDetecting = false;
          this.gpsDetected = true;
          this.showManualForm = true;
          this.selectedSavedAddress = null;
        });

        // Silently update with real address in background
        this.reverseGeocode(lat, lng);
      },
      (error) => {
        this.ngZone.run(() => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.gpsError = 'Location permission denied. Please allow access in browser settings.'; break;
            case error.POSITION_UNAVAILABLE:
              this.gpsError = 'Location unavailable. Please enter your address manually.'; break;
            case error.TIMEOUT:
              this.gpsError = 'GPS timed out. Please enter manually.'; break;
            default:
              this.gpsError = 'Could not detect location. Please enter manually.';
          }
          this.isDetecting = false;
          this.showManualForm = true;
        });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }

  reverseGeocode(lat: number, lng: number) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { signal: controller.signal, headers: { 'Accept-Language': 'en-IN,en' } }
    )
      .then(res => { clearTimeout(timer); return res.json(); })
      .then(data => {
        const a = data.address || {};
        const line1 = [a.house_number, a.road || a.street, a.suburb || a.neighbourhood]
          .filter(Boolean).join(', ') || data.display_name || '';
        const city = a.city || a.town || a.village || a.county || '';
        const state = a.state || '';
        const pincode = (a.postcode || '').replace(/\s+/g, '');

        this.ngZone.run(() => {
          this.addressForm.patchValue({ line1, city, state, pincode });
          this.addressForm.markAllAsTouched();
        });
      })
      .catch(() => { clearTimeout(timer); /* form already open — user fills manually */ });
  }

  get canContinue(): boolean {
    if (this.selectedSavedAddress !== null) return true;
    return this.addressForm.valid;
  }

  proceed() {
    if (!this.canContinue) { this.addressForm.markAllAsTouched(); return; }

    // ✅ Save address to shared API state
    if (this.selectedSavedAddress !== null) {
      const saved = this.savedAddresses.find(a => a.id === this.selectedSavedAddress)!;
      this.api.updateAddress({
        line1: saved.line1, line2: '', landmark: '',
        city: saved.city, state: saved.state, pincode: saved.pincode
      });
    } else {
      const v = this.addressForm.value;
      this.api.updateAddress({
        line1: v.line1, line2: v.line2 || '', landmark: v.landmark || '',
        city: v.city, state: v.state, pincode: v.pincode
      });
    }

    this.router.navigate(['/booking-summary']);
  }
}
