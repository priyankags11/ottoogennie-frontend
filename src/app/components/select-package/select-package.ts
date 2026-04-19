
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-select-package',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './select-package.html',
  styleUrls: ['./select-package.css']
})
export class SelectPackage {

  constructor(private router: Router) { }

  packages = [
    {
      id: 'basic',
      name: 'Basic Service',
      tagline: 'Essential maintenance for everyday driving',
      price: 2372,
      actualPrice: 3163,
      duration: '4 hrs',
      badge: '',
      icon: '🔧',
      color: '#E3F2FD',
      accentColor: '#1565C0',
      features: [
        { icon: '🛢️', text: 'Engine Oil Replacement' },
        { icon: '🔩', text: 'Oil Filter Replacement' },
        { icon: '🚗', text: 'Car Wash & Vacuum' },
        { icon: '🔋', text: 'Battery Water Top-Up' },
        { icon: '🪟', text: 'Wiper Fluid Refill' }
      ]
    },
    {
      id: 'standard',
      name: 'Standard Service',
      tagline: 'Complete service for optimum performance',
      price: 2911,
      actualPrice: 4159,
      duration: '6 hrs',
      badge: 'Most Popular',
      icon: '⚙️',
      color: '#FFF3E0',
      accentColor: '#E65100',
      features: [
        { icon: '💻', text: 'Car Computer Scanning' },
        { icon: '🛑', text: 'Brake Pads Inspection' },
        { icon: '🌬️', text: 'Air Filter Cleaning' },
        { icon: '🛢️', text: 'Engine Oil Change' },
        { icon: '🔩', text: 'Oil Filter Replacement' },
        { icon: '🚗', text: 'Full Car Wash' }
      ]
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Service',
      tagline: 'Full overhaul — leave nothing to chance',
      price: 4999,
      actualPrice: 6999,
      duration: '8 hrs',
      badge: 'Best Value',
      icon: '🏆',
      color: '#F3E5F5',
      accentColor: '#6A1B9A',
      features: [
        { icon: '🔍', text: 'Full 100-Point Inspection' },
        { icon: '❄️', text: 'AC Service & Recharge' },
        { icon: '🛑', text: 'Complete Brake Service' },
        { icon: '⚡', text: 'Engine Tuning & Calibration' },
        { icon: '✨', text: 'Interior Deep Cleaning' },
        { icon: '🪞', text: 'Exterior Polish & Wax' }
      ]
    }
  ];

  selectedPackage: any = null;

  getDiscount(pkg: any): number {
    return Math.round((1 - pkg.price / pkg.actualPrice) * 100);
  }

  selectPackage(pkg: any) {
    this.selectedPackage = pkg;
  }

  navToSlot() {
    this.router.navigate(['/select-slot']);
  }
}
