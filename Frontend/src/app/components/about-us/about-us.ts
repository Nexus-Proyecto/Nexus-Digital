import { Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form';

@Component({
  selector: 'app-about-us',
  imports: [ContactFormComponent],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {}
