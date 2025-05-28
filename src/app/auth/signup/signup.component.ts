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

  // Utility function for password strength
  checkPasswordStrength(password: string): boolean {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // At least 8 characters, 1 digit, 1 uppercase letter, 1 lowercase letter
    return passwordRegex.test(password);
  }

  // onSubmit(form: NgForm) {
  //   if (this.password !== this.confirmPassword) {
  //     Swal.fire({
  //       title: 'Password Mismatch',
  //       text: 'Passwords do not match. Please try again.',
  //       icon: 'error',
  //       confirmButtonColor: '#d33',
  //       confirmButtonText: 'Try Again'
  //     });
  //     return;
  //   }

  //   // Check password strength before proceeding
  //   // if (!this.checkPasswordStrength(this.password)) {
  //   //   Swal.fire({
  //   //     title: 'Weak Password',
  //   //     text: 'Your password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers.',
  //   //     icon: 'error',
  //   //     confirmButtonColor: '#d33',
  //   //     confirmButtonText: 'Try Again'
  //   //   });
  //   //   return;
  //   // }

  //   const formData = {
  //     username: this.username,
  //     email: this.email,
  //     gender: this.gender,
  //     phone: this.phone,
  //     password: this.password
  //   };

  //   this.apiService.register(formData).subscribe({
  //     next: (response) => {
  //       localStorage.setItem('token', response.token);
  //       localStorage.setItem('customer', JSON.stringify(response.customer));
  //       Swal.fire({
  //         title: 'Registered Successfully!',
  //         text: 'You have successfully registered.',
  //         icon: 'success',
  //         timer: 1000, // Auto close after 1 second
  //         showConfirmButton: false, // Hides the confirm button
  //         timerProgressBar: true, // Optional: shows a progress bar
  //         didClose: () => {
  //           this.router.navigate(['/deshboard']);
  //         }
  //       });
        
  //     },
  //     error: (error) => {
  //       console.error('Registration failed', error);
  //       let errorMessage = 'Registration failed. Please check your input and try again.';
  //       if (error.error.errors) {
  //         if (error.error.errors.phone) {
  //           errorMessage = 'This phone number is already registered. Please use a different phone number or login.';
  //         } else if (error.error.errors.email) {
  //           errorMessage = 'This email is already registered. Please use a different email or login.';
  //         }
  //       }
  //       Swal.fire({
  //         title: 'Registration Failed!',
  //         text: errorMessage,
  //         icon: 'error',
  //         confirmButtonColor: '#d33',
  //         confirmButtonText: 'Try Again'
  //       });
  //     }
  //   });
  // }
  onSubmit() {
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
