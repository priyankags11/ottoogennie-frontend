


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-select-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './select-vehicle.html',
  styleUrls: ['./select-vehicle.css']
})
export class SelectVehicle {

  step = 1;

  fuels = [
    {
      name: 'Petrol',
      icon: '⛽',
      desc: 'Most common fuel type',
      color: '#FFF3E0',
      accent: '#E65100'
    },
    {
      name: 'Diesel',
      icon: '🛢️',
      desc: 'Higher torque & mileage',
      color: '#E8F5E9',
      accent: '#2E7D32'
    },
    {
      name: 'CNG',
      icon: '💨',
      desc: 'Eco-friendly & cost-effective',
      color: '#E3F2FD',
      accent: '#1565C0'
    },
    {
      name: 'Electric',
      icon: '⚡',
      desc: 'Zero emission vehicle',
      color: '#F3E5F5',
      accent: '#6A1B9A'
    }
  ];

  selectedFuel = '';

  allBrands: string[] = [
    'audi', 'bentley', 'bmw', 'cadillac', 'chevrolet',
    'citroen', 'datsun', 'ferrari', 'fiat', 'ford',
    'honda', 'hyundai', 'jaguar', 'jeep', 'kia',
    'lamborghini', 'land-rover', 'lexus', 'mahindra', 'maruti',
    'mazda', 'mercedes', 'mini', 'mitsubishi', 'nissan',
    'peugeot', 'porsche', 'renault', 'rolls-royce', 'skoda',
    'suzuki', 'tata', 'tesla', 'toyota', 'volkswagen', 'volvo'
  ];

  //brandColors: Record<string, string> = [
  //  //audi: '#BB0A21', bmw: '#0066B1', ford: '#003478', honda: '#CC0000',
  //  //hyundai: '#002C5F', jeep: '#7DA741', kia: '#05141F', mahindra: '#E31837',
  //  //maruti: '#003DA5', mercedes: '#222222', mitsubishi: '#CB0E25', nissan: '#C3002F',
  //  //renault: '#EFDF00', skoda: '#4BA82E', tata: '#002060', tesla: '#CC0000',
  //  //toyota: '#EB0A1E', volkswagen: '#001E50', volvo: '#003057', porsche: '#8B0000',
  //  //ferrari: '#FF2800', lamborghini: '#D4A017', land - rover: '#005A2B', lexus: '#1A1A1A',
  //  //bentley: '#2E5F3E', cadillac: '#B8960C', chevrolet: '#D4AF37', citroen: '#7B3F00',
  //  //datsun: '#C0392B', fiat: '#1A3A6B', jaguar: '#0A0A0A', mazda: '#910000',
  //  //mini: '#1E1E1E', peugeot: '#1F3A6B', 'rolls-royce': '#6B0F1A', suzuki: '#003087'
  //];

selectedBrand = '';
searchText = '';
visibleCount = 18;

models: Record<string, string[]> = {
  hyundai: ['Grand i10', 'i20', 'Creta', 'Alcazar', 'Venue', 'Tucson', 'Verna'],
  maruti: ['Swift', 'Baleno', 'WagonR', 'Brezza', 'Dzire', 'Ertiga', 'Grand Vitara'],
  tata: ['Nexon', 'Tiago', 'Harrier', 'Safari', 'Tigor', 'Punch', 'Curvv'],
  honda: ['City', 'Amaze', 'WR-V', 'Elevate', 'Jazz'],
  ford: ['EcoSport', 'Figo', 'Endeavour'],
  mahindra: ['XUV300', 'XUV700', 'Scorpio', 'Thar', 'XUV400', 'Bolero'],
  renault: ['Kwid', 'Duster', 'Kiger', 'Triber'],
  volkswagen: ['Polo', 'Vento', 'Taigun', 'Virtus'],
  toyota: ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry', 'Vellfire'],
  kia: ['Seltos', 'Sonet', 'Carens', 'EV6'],
  bmw: ['3 Series', '5 Series', 'X1', 'X3', 'X5', 'X7'],
  mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'],
  audi: ['A4', 'A6', 'Q3', 'Q5', 'Q7'],
  skoda: ['Rapid', 'Kushaq', 'Slavia', 'Superb'],
  nissan: ['Magnite', 'Kicks', 'X-Trail'],
  mitsubishi: ['Outlander', 'Eclipse Cross', 'Pajero'],
  //tata: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Tiago', 'Altroz'],
  tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
};

selectedModel: string | null = null;

constructor(private router: Router) { }

  get filteredBrands(): string[] {
  return this.allBrands.filter(b =>
    b.toLowerCase().includes(this.searchText.toLowerCase())
  );
}

  get paginatedBrands(): string[] {
  return this.filteredBrands.slice(0, this.visibleCount);
}

loadMore() { this.visibleCount += 9; }

getBrandColor(name: string): string {
  return '#333333';
}

getInitials(name: string): string {
  return name.split('-').map(w => w[0].toUpperCase()).join('').slice(0, 2);
}

getLogo(name: string): string {
  return `assets/thumb/${name}.png`;
}

selectFuel(fuel: string) {
  this.selectedFuel = fuel;
  setTimeout(() => { this.step = 2; }, 250);
}

selectBrand(brand: string) {
  this.selectedBrand = brand.toLowerCase();
  this.selectedModel = null;
  this.step = 3;
}

selectModel(model: string) {
  this.selectedModel = model;
}

goBack() {
  if (this.step > 1) {
    this.step--;
    if (this.step === 1) { this.selectedFuel = ''; }
    if (this.step === 2) { this.selectedModel = null; }
  }
}

getCarImage(brand: string, model: string) {
  //return `https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=60`;
}

onImageError(event: any) {
  event.target.style.display = 'none';
}
}
