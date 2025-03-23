import { Component,Inject,OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  

  constructor(
    private authService: ApiService, 
    private router: Router,
  ) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to login page
  }
  
}
