import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  standalone: false,
  
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

//   username: string = '';
//   email: string = '';
//   gender: string = 'male'; // Default gender
//   phone: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   registerForm: any;
//   constructor(
//     private apiService: ApiService,
//     private router: Router
//   ) {}

//   // Utility function for password strength
//   checkPasswordStrength(password: string): boolean {
//     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // At least 8 characters, 1 digit, 1 uppercase letter, 1 lowercase letter
//     return passwordRegex.test(password);
//   }

//   onSubmit() {
//     if (this.password === this.confirmPassword) {
//       const formData = {
//         username:this.username,
//         email: this.email,
//         gender:this.gender,
//         phone:this.phone,
//         password: this.password
//       };

//       this.apiService.register(formData).subscribe({
//         next: (response) => {
//           localStorage.setItem('username', response.customer.username);
// localStorage.setItem('gender', response.customer.gender);
// localStorage.setItem('phone', response.customer.phone);
// localStorage.setItem('email', response.customer.email);
//           Swal.fire({
//             title: 'Registered Successfully!',
//             text: 'You have successfully registered.',
//             icon: 'success',
//             confirmButtonColor: '#3085d6',
//             confirmButtonText: 'Go to Login'
//           }).then((result) => {
//             if (result.isConfirmed) {
//               this.router.navigate(['/login']);
//             }
//           });
//         },
//         error: (error) => {
//           console.error('Registration failed', error);
//           // Check for specific backend validation errors
//           if (error.error.errors && error.error.errors.phone) {
//             Swal.fire({
//               title: 'Registration Failed!',
//               text: 'This phone number is already registered. Please use a different phone number or login.',
//               icon: 'error',
//               confirmButtonColor: '#d33',
//               confirmButtonText: 'Try Again'
//             });
//           } else {
//             // Generic error message for other types of validation failures
//             const message = error.error.message || 'Registration failed. Please check your input and try again.';
//             Swal.fire({
//               title: 'Registration Failed!',
//               text: message,
//               icon: 'error',
//               confirmButtonColor: '#d33',
//               confirmButtonText: 'Try Again'
//             });
//           }
//         }
//       });
//     } else {
//       Swal.fire({
//         title: 'Password Mismatch',
//         text: 'Passwords do not match. Please try again.',
//         icon: 'error',
//         confirmButtonColor: '#d33',
//         confirmButtonText: 'Try Again'
//       });
//     }
//   }
username: string = '';
  email: string = '';
  gender: string = 'male';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.showAlert('Password Mismatch', 'Passwords do not match. Please try again.', 'error');
      return;
    }

    this.loading = true;

    const userData = {
      username: this.username,
      email: this.email,
      gender: this.gender,
      phone: this.phone,
      password: this.password
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.showAlert(
          'Registered Successfully!',
          'You have successfully registered.',
          'success',
          'Go to Login'
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        const err = error.error?.errors;

        if (err?.phone) {
          this.showAlert('Phone Exists!', err.phone[0], 'error');
        } else {
          this.showAlert(
            'Registration Failed',
            error.error?.message || 'Please check your input and try again.',
            'error'
          );
        }
      }
    });
  }

  // 🔔 Reusable SweetAlert2 function
  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', confirmText: string = 'OK') {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: icon === 'success' ? '#3085d6' : '#d33',
      confirmButtonText: confirmText
    });
  }
}
