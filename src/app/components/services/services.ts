import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {

  constructor(private router: Router) { }

  bookService() {
    this.router.navigate(['/booking']);
  }
}
