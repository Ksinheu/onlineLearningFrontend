import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedin = false; // Track authentication status

  constructor(
    private authService: ApiService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedin = !!localStorage.getItem('token'); // Only runs on the client-side
    }
  }
}
