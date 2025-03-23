import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-side-bar2',
  standalone: false,
  
  templateUrl: './side-bar2.component.html',
  styleUrl: './side-bar2.component.css'
})
export class SideBar2Component {
  
  isLoggedIn = false; // Track authentication status
  
    constructor(
      private authService: ApiService, 
      private router: Router,
       @Inject(PLATFORM_ID) private platformId: Object) {}
  
    ngOnInit(): void {
       this.isLoggedIn = !!localStorage.getItem('token');
      this.checkLoginStatus(); // Check login status when component initializes
    }
  
    checkLoginStatus(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.isLoggedIn = !!localStorage.getItem('token');
      }
    }
    logout(): void {
      this.authService.logout().subscribe({
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
