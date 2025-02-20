import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email:string='';
  password:string='';
  errorMessage:string='';

  constructor(private apiService:ApiService,private router:Router){}

  onLogin(form: NgForm) {
    if (form.valid) {
      this.apiService.Login(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // SweetAlert for successful login
          Swal.fire({
            title: 'Login Successful!',
            text: 'Welcome back!',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Continue'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']); // Navigate to dashboard
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
