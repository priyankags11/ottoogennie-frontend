import { Routes } from '@angular/router';
import { Home } from './components/home';


export const routes: Routes = [
  { path: '', component:  Home},
  {
    path: 'booking',
    loadComponent: () =>
      import('./components/booking/booking').then(m => m.Booking)
  },
  // app.routes.ts
  {
    path: 'select-vehicle',
    loadComponent: () =>
      import('./components/select-vehicle/select-vehicle')
        .then(m => m.SelectVehicle)
  },
  {
    path: 'select-package',
    loadComponent: () =>
      import('./components/select-package/select-package')
        .then(m => m.SelectPackage)
  },
  {
    path: 'select-slot',
    loadComponent: () =>
      import('./components/slot-selection/slot-selection')
        .then(m => m.SlotSelection)
  },
  {
    path: 'booking-summary',
    loadComponent: () =>
      import('./components/booking-summary/booking-summary')
        .then(m => m.BookingSummary)
  },
  {
    path: 'address',
    loadComponent: () =>
      import('./components/address/address')
        .then(m => m.Address)
  }
];
