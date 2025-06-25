import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn = false;
  username: string|null = '';

  constructor(
    private authService: ApiService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username');
    }
    // this.authService.currentUser$.subscribe((customer) => {
    //   this.username = customer?.username || '';
    // });
  }

  logout() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.forceLogout('Already Logged Out', 'No token found. You are already logged out.', 'warning');
      return;
    }
  
    Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to log out?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.forceLogout('Already Logged Out', 'No token found. You are already logged out.', 'warning');
        return;
      }

      this.authService.Logout().subscribe({
        next: () => {
          this.clearSession();
          this.authService.clearUser();
          this.authService.isLoggedIn.next(false);
          this.forceLogout('Logged Out', 'You have successfully logged out.', 'success');
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.clearSession();
          this.authService.clearUser();
          this.authService.isLoggedIn.next(false);
          this.forceLogout('Logout Failed', 'There was an issue logging out. You were redirected anyway.', 'error');
        },
        complete: () => {
          this.authService.isLoggedIn.next(false);
        }
      });
    }
  });
  }
  
  private forceLogout(title: string, text: string, icon: 'success' | 'error' | 'warning') {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#3085d6',
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
  
  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
  }
}
