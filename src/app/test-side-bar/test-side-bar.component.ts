import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LogoutService } from '../Services/logout.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-test-side-bar',
  standalone: false,
  
  templateUrl: './test-side-bar.component.html',
  styleUrl: './test-side-bar.component.css'
})
export class TestSideBarComponent {
  isLoggedIn = false;

  constructor(
    private authService: LogoutService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only access localStorage in the browser
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to login page
  }
}
