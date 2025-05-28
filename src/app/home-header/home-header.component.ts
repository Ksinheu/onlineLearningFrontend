import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-home-header',
  standalone: false,
  
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.css'
})
export class HomeHeaderComponent implements OnInit{
  email:string='';
  password:string='';
  errorMessage:string='';
  userName: string = '';
  Islogined: boolean = false;
  // isBrowser: boolean;
  constructor(private apiService:ApiService,private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  ngOnInit(): void {
 
  }
    onLogin(form: NgForm) {
      if (form.valid) {
        this.apiService.Login(this.email, this.password).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            // SweetAlert for successful login
            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: 'Login Successful!',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didClose: () => {
                this.router.navigate(['/deshboard']);
              }
            });
            
          },
          error: (error) => {
            console.error('Login error', error);
            Swal.fire({
              title: 'Login Failed!',
              text: 'Failed to login. Please check your credentials.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Try Again'
            });
            this.errorMessage = 'Failed to login. Please check your credentials.';
          }
        });
      } else {
        this.errorMessage = 'Please fill in all fields correctly.';
        Swal.fire({
          title: 'Error!',
          text: 'Please fill in all fields correctly.',
          icon: 'warning',
          confirmButtonColor: '#ffc107',
          confirmButtonText: 'OK'
        });
      }
    }
}
