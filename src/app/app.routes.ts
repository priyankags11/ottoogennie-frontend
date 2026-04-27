import { Routes } from '@angular/router';
import { Home } from './components/home';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home').then(m => m.Home)
  },
  {
    path: 'booking',
    loadComponent: () => import('./components/booking/booking').then(m => m.Booking)
  },
  {
    path: 'select-vehicle',
    loadComponent: () => import('./components/select-vehicle/select-vehicle').then(m => m.SelectVehicle)
  },
  {
    path: 'select-package',
    loadComponent: () => import('./components/select-package/select-package').then(m => m.SelectPackage)
  },
  {
    path: 'select-slot',
    loadComponent: () => import('./components/slot-selection/slot-selection').then(m => m.SlotSelection)
  },
  {
    path: 'address',
    loadComponent: () => import('./components/address/address').then(m => m.Address)
  },
  {
    path: 'booking-summary',
    loadComponent: () => import('./components/booking-summary/booking-summary').then(m => m.BookingSummary)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
  path: 'review',
  loadComponent: () => import('./components/review/review').then(m => m.Review)
  },
  { path: '**', redirectTo: '' }
];
