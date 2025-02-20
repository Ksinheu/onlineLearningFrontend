import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'lms-frontend';
}
