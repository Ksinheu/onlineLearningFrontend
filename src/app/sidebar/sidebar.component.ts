import { Component,Inject,OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  
  isLoggedIn = false;
  constructor(
    private authService: ApiService, 
    private router: Router,
  ) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to login page
  }
  ngOnInit() {
     // Check token at startup
     this.isLoggedIn = this.authService.isLoggedIn();

     // Listen to real-time login/logout
     this.authService.isLoggedIn1().subscribe((status) => {
       this.isLoggedIn = status;
     });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.authService.clearSession(); // Clears token + redirects
    });
  }
}

