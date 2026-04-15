import { Routes } from '@angular/router';
import { Home } from './components/home';


export const routes: Routes = [
  { path: '', component:  Home},
  {
    path: 'booking',
    loadComponent: () =>
      import('./components/booking/booking').then(m => m.Booking)
  }
];
