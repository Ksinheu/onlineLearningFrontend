import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  errorMessage:string='';
  userName: string = '';

  constructor(private apiService:ApiService,private router:Router,  @Inject(PLATFORM_ID) private platformId: Object){}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      this.apiService.Login(this.email, this.password).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.customer.username);
          localStorage.setItem('customer_id', response.customer.id); // ✅ get from user
          console.log('Logged in as:', response.customer.username);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Login error:', error);
          this.errorMessage = 'Invalid credentials. Please try again.';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }
}
