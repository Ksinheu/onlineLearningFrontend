import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: false,
  providers: [ApiService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 

})
export class HomeComponent {
  isLoggedIn = false; // Track authentication status
  loading=false;
  constructor(
    private authService: ApiService, 
    private router: Router,
     @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Check login status when component initializes
  }

  checkLoginStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }
  logout(): void {
    this.authService.Logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.authService.clearSession(); // Clear session
        this.isLoggedIn = false; // Update navbar status
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.authService.clearSession(); // Ensure session is cleared even if API fails
        this.isLoggedIn = false;
      }
    });
  }
}
