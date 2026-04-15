import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Contact } from './contact/contact';
import { HowItWorks } from './how-it-works/how-it-works';
import { Services } from './services/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Services, HowItWorks, Contact],
  template: `
    <app-hero></app-hero>
    <app-services></app-services>
    <app-how-it-works></app-how-it-works>
    <app-contact></app-contact>
  `
})
export class Home { }
