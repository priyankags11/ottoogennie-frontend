import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  activeTab: 'user' | 'admin' = 'user';

  // User login
  phoneOrEmail = '';
  userError = '';
  userLoading = false;

  // Admin login
  adminKey = '';
  adminError = '';
  adminLoading = false;
  showAdminKey = false;

  constructor(private http: HttpClient, private router: Router) { }

  switchTab(tab: 'user' | 'admin') {
    this.activeTab = tab;
    this.userError = '';
    this.adminError = '';
  }

  loginUser() {
    if (!this.phoneOrEmail.trim()) {
      this.userError = 'Please enter your phone number or email.';
      return;
    }
    this.userLoading = true;
    this.userError = '';

    this.http.post<any>(`${environment.apiUrl}/api/auth/user`, {
      phoneOrEmail: this.phoneOrEmail.trim()
    }).subscribe({
      next: (res) => {
        this.userLoading = false;
        // Store in sessionStorage for dashboard
        sessionStorage.setItem('rr_session', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.userLoading = false;
        this.userError = err.error?.message || 'No account found. Please book a service first.';
      }
    });
  }

  loginAdmin() {
    if (!this.adminKey.trim()) {
      this.adminError = 'Please enter your admin key.';
      return;
    }
    this.adminLoading = true;
    this.adminError = '';

    this.http.post<any>(`${environment.apiUrl}/api/auth/admin`, {
      adminKey: this.adminKey.trim()
    }).subscribe({
      next: (res) => {
        this.adminLoading = false;
        sessionStorage.setItem('rr_session', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.adminLoading = false;
        this.adminError = err.error?.message || 'Invalid admin key.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
