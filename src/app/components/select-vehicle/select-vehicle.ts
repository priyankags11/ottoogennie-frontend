import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api';

export interface ModelEntry {
  name: string;
  image: string;
  fuels: string[];
}

export interface BrandEntry {
  key: string;
  displayName: string;
  color: string;
  logo: string;
  models: ModelEntry[];
}

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
    { name: 'Petrol', icon: '⛽', desc: 'Most common fuel type', color: '#FFF3E0', accent: '#E65100' },
    { name: 'Diesel', icon: '🛢️', desc: 'Higher torque & mileage', color: '#E8F5E9', accent: '#2E7D32' },
    { name: 'CNG', icon: '💨', desc: 'Eco-friendly & cost-effective', color: '#E3F2FD', accent: '#1565C0' },
    { name: 'Electric', icon: '⚡', desc: 'Zero emission vehicle', color: '#F3E5F5', accent: '#6A1B9A' }
  ];

  selectedFuel = '';

  allBrands: BrandEntry[] = [
    {
      key: 'honda', displayName: 'Honda', color: '#CC0000',
      logo: 'assets/thumb/honda.png',
      models: [
        { name: 'City', image: 'assets/cars/honda/city.jpg', fuels: ['Petrol', 'Diesel', 'CNG'] },
        { name: 'City i-VTEC', image: 'assets/cars/honda/cityIVTEC.jpg', fuels: ['Petrol'] },
        { name: 'City ZX', image: 'assets/cars/honda/cityzx.jpg', fuels: ['Petrol'] },
        { name: 'Amaze', image: 'assets/cars/honda/amaze.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Brio', image: 'assets/cars/honda/brio.jpg', fuels: ['Petrol'] },
        { name: 'Jazz', image: 'assets/cars/honda/Jazz.jpg', fuels: ['Petrol'] },
        { name: 'WR-V', image: 'assets/cars/honda/wrv.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Civic', image: 'assets/cars/honda/civic.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Accord', image: 'assets/cars/honda/accord.jpg', fuels: ['Petrol', 'Diesel'] },
      ]
    },
    {
      key: 'ford', displayName: 'Ford', color: '#003478',
      logo: 'assets/thumb/ford.png',
      models: [
        { name: 'Figo', image: 'assets/cars/ford/figo.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Freestyle', image: 'assets/cars/ford/freestyle.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Fiesta', image: 'assets/cars/ford/fiesta.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'EcoSport', image: 'assets/cars/ford/ecosport.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Endeavour', image: 'assets/cars/ford/endeavour.jpg', fuels: ['Diesel'] },
      ]
    },
    {
      key: 'hyundai', displayName: 'Hyundai', color: '#002C5F',
      logo: 'assets/thumb/hyundai.png',
      models: [
        { name: 'Grand i10', image: 'assets/cars/hyundai/grandi10.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'i20', image: 'assets/cars/hyundai/i20.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Creta', image: 'assets/cars/hyundai/creta.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Venue', image: 'assets/cars/hyundai/venue.jpg', fuels: ['Petrol', 'Diesel', 'CNG'] },
        { name: 'Verna', image: 'assets/cars/hyundai/verna.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Alcazar', image: 'assets/cars/hyundai/alcazar.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Tucson', image: 'assets/cars/hyundai/tucson.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Ioniq 5', image: 'assets/cars/hyundai/ioniq5.jpg', fuels: ['Electric'] },
      ]
    },
    {
      key: 'maruti', displayName: 'Maruti', color: '#003DA5',
      logo: 'assets/thumb/maruti.png',
      models: [
        { name: 'Swift', image: 'assets/cars/maruti/swift.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Baleno', image: 'assets/cars/maruti/baleno.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'WagonR', image: 'assets/cars/maruti/wagonr.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Brezza', image: 'assets/cars/maruti/brezza.jpg', fuels: ['Petrol'] },
        { name: 'Dzire', image: 'assets/cars/maruti/dzire.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Ertiga', image: 'assets/cars/maruti/ertiga.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Grand Vitara', image: 'assets/cars/maruti/grandvitara.jpg', fuels: ['Petrol'] },
      ]
    },
    {
      key: 'tata', displayName: 'Tata', color: '#002060',
      logo: 'assets/thumb/tata.png',
      models: [
        { name: 'Nexon', image: 'assets/cars/tata/nexon.jpg', fuels: ['Petrol', 'Diesel', 'Electric'] },
        { name: 'Tiago', image: 'assets/cars/tata/tiago.jpg', fuels: ['Petrol', 'CNG', 'Electric'] },
        { name: 'Harrier', image: 'assets/cars/tata/harrier.jpg', fuels: ['Diesel'] },
        { name: 'Safari', image: 'assets/cars/tata/safari.jpg', fuels: ['Diesel'] },
        { name: 'Punch', image: 'assets/cars/tata/punch.jpg', fuels: ['Petrol', 'CNG', 'Electric'] },
        { name: 'Altroz', image: 'assets/cars/tata/altroz.jpg', fuels: ['Petrol', 'Diesel', 'CNG'] },
      ]
    },
    {
      key: 'mahindra', displayName: 'Mahindra', color: '#E31837',
      logo: 'assets/thumb/mahindra.png',
      models: [
        { name: 'XUV300', image: 'assets/cars/mahindra/xuv300.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'XUV700', image: 'assets/cars/mahindra/xuv700.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Scorpio', image: 'assets/cars/mahindra/scorpio.jpg', fuels: ['Diesel'] },
        { name: 'Thar', image: 'assets/cars/mahindra/thar.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Bolero', image: 'assets/cars/mahindra/bolero.jpg', fuels: ['Diesel'] },
        { name: 'XUV400', image: 'assets/cars/mahindra/xuv400.jpg', fuels: ['Electric'] },
      ]
    },
    {
      key: 'toyota', displayName: 'Toyota', color: '#EB0A1E',
      logo: 'assets/thumb/toyota.png',
      models: [
        { name: 'Innova', image: 'assets/cars/toyota/innova.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Fortuner', image: 'assets/cars/toyota/fortuner.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'Glanza', image: 'assets/cars/toyota/glanza.jpg', fuels: ['Petrol', 'CNG'] },
        { name: 'Urban Cruiser', image: 'assets/cars/toyota/urbancruiser.jpg', fuels: ['Petrol'] },
      ]
    },
    {
      key: 'kia', displayName: 'Kia', color: '#05141F',
      logo: 'assets/thumb/kia.png',
      models: [
        { name: 'Seltos', image: 'assets/cars/kia/seltos.jpg', fuels: ['Petrol', 'Diesel', 'CNG'] },
        { name: 'Sonet', image: 'assets/cars/kia/sonet.jpg', fuels: ['Petrol', 'Diesel', 'CNG'] },
        { name: 'Carens', image: 'assets/cars/kia/carens.jpg', fuels: ['Petrol', 'Diesel'] },
        { name: 'EV6', image: 'assets/cars/kia/ev6.jpg', fuels: ['Electric'] },
      ]
    },
    {
      key: 'tesla', displayName: 'Tesla', color: '#CC0000',
      logo: 'assets/thumb/tesla.png',
      models: [
        { name: 'Model 3', image: 'assets/cars/tesla/model3.jpg', fuels: ['Electric'] },
        { name: 'Model Y', image: 'assets/cars/tesla/modely.jpg', fuels: ['Electric'] },
        { name: 'Model S', image: 'assets/cars/tesla/models.jpg', fuels: ['Electric'] },
      ]
    },
  ];

  selectedBrand: BrandEntry | null = null;
  searchText = '';
  visibleCount = 18;
  selectedModel: ModelEntry | null = null;

  constructor(private router: Router, private ngZone: NgZone, private api: Api) { }

  get brandsForFuel(): BrandEntry[] {
    if (!this.selectedFuel) return this.allBrands;
    return this.allBrands.filter(b =>
      b.models.some(m => m.fuels.includes(this.selectedFuel))
    );
  }

  get filteredBrands(): BrandEntry[] {
    const q = this.searchText.toLowerCase();
    return this.brandsForFuel.filter(b =>
      b.displayName.toLowerCase().includes(q) || b.key.includes(q)
    );
  }

  get paginatedBrands(): BrandEntry[] {
    return this.filteredBrands.slice(0, this.visibleCount);
  }

  get modelsForSelection(): ModelEntry[] {
    if (!this.selectedBrand) return [];
    return this.selectedBrand.models.filter(m => m.fuels.includes(this.selectedFuel));
  }

  loadMore() { this.visibleCount += 9; }

  getInitials(b: BrandEntry): string {
    return b.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  fuelModelCount(b: BrandEntry): number {
    return b.models.filter(m => m.fuels.includes(this.selectedFuel)).length;
  }

  selectFuel(fuel: string) {
    this.ngZone.run(() => {
      this.selectedFuel = fuel;
      this.selectedBrand = null;
      this.selectedModel = null;
      this.searchText = '';
      this.visibleCount = 18;
      this.step = 2;
    });
  }

  selectBrand(brand: BrandEntry) {
    this.selectedBrand = brand;
    this.selectedModel = null;
    this.step = 3;
  }

  selectModel(model: ModelEntry) {
    this.selectedModel = model;
    // ✅ Save to shared API state
    this.api.updateVehicle(
      this.selectedFuel,
      this.selectedBrand!.displayName,
      model.name
    );
  }

  goBack() {
    if (this.step === 3) { this.selectedModel = null; this.step = 2; }
    else if (this.step === 2) { this.selectedFuel = ''; this.selectedBrand = null; this.step = 1; }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
