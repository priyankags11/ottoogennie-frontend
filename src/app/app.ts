import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  isBookingPage = false;
  protected readonly title = signal('ottoogennie-frontend');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isBookingPage = this.router.url.includes('booking');
    });
  }
}
