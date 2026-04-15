import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

  constructor(private router: Router) { }

  bookService() {
    // 👉 Navigate instead of API call
    this.router.navigate(['/booking']);
  }
}
