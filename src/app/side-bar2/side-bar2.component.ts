import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar2',
  standalone: false,
  
  templateUrl: './side-bar2.component.html',
  styleUrl: './side-bar2.component.css'
})
export class SideBar2Component {
 
  isLoggedIn1 = false; // Track authentication status
  
    constructor(
      private authService: ApiService, 
      private router: Router,
       @Inject(PLATFORM_ID) private platformId: Object) {}
  
    ngOnInit(): void {
     
     this.authService.isLoggedIn.subscribe((status) => {
       this.isLoggedIn1 = status;
     });
    }
  
    checkLoginStatus(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.isLoggedIn1 = !!localStorage.getItem('token');
      }
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
