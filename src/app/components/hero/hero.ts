import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

  constructor(private router: Router) { }

  bookService() {
    this.router.navigate(['/booking']);
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }
}
