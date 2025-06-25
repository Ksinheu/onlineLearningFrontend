import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-personal',
  standalone: false,
  
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent {
 profile: any = {};
 constructor(
    private authService: ApiService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngOnInit(): void {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.authService.getProfile(+customerId).subscribe({
        next: res => this.profile = res,
        error: err => console.error('Profile fetch failed', err)
      });
    }
  }


   onLogout() {
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
      // this.authService.Logout().subscribe({
      //   next: () => {
      //     this.clearSession();
      //     this.authService.clearUser(); 
      //     this.authService.isLoggedIn.next(false); // This line is correct
      //     this.forceLogout('Logged Out', 'You have successfully logged out.', 'success');
      //   },
      //   error: (error) => {
      //     console.error('Logout error:', error);
      //     this.clearSession();
      //     this.authService.clearUser();
      //     this.authService.isLoggedIn.next(false);
      //     this.forceLogout('Logout Failed', 'There was an issue logging out. You were redirected anyway.', 'error');
      //   },
      //   complete: () => {
      //     this.authService.isLoggedIn.next(false);
      //   }
      // });
    }
    
    private forceLogout(title: string, text: string, icon: 'success' | 'error' | 'warning') {
      Swal.fire({
        icon,
        title,
        text,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
    
    private clearSession() {
      localStorage.removeItem('token');
      localStorage.removeItem('redirectAfterLogin');
    }

}
