import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { error } from 'console';


@Component({
  selector: 'app-signup',
  standalone: false,
  
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  username: string = '';
  email: string = '';
  gender: string = 'male'; // Default gender
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  registerForm: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (this.password === this.confirmPassword) {
      const formData = {
        username:this.username,
        email: this.email,
        gender:this.gender,
        phone:this.phone,
        password: this.password
  
      };

      this.apiService.register(formData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Registered Successfully!',
            text: 'You have successfully registered.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Go to Login'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Check for specific backend validation errors
          if (error.error.errors && error.error.errors.phone) {
            Swal.fire({
              title: 'Registration Failed!',
              text: 'This phone number is already registered. Please use a different phone number or login.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Try Again'
            });
          } else {
            // Generic error message for other types of validation failures
            const message = error.error.message || 'Registration failed. Please check your input and try again.';
            Swal.fire({
              title: 'Registration Failed!',
              text: message,
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Try Again'
            });
          }
        }
      });
    } else {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Try Again'
      });
    }
  }

}
