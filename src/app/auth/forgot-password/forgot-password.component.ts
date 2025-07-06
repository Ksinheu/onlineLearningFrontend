import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService,private router:Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

//   submit() {
//   if (this.form.invalid) return;

//   this.api.forgot_password('forgot-password', this.form.value).subscribe({
//     next: (res: any) => {
//       Swal.fire('Success', res.message, 'success');
//       this.form.reset();
//     },
//     error: err => {
//       if (err.status === 422 && err.error.errors) {
//         const errors = err.error.errors;
//         if (errors.email) {
//           this.form.controls['email'].setErrors({ server: errors.email[0] });
//         }
//       } else {
//         Swal.fire('Error', 'Something went wrong.', 'error');
//       }
//     }
//   });
// }
// submit() {
//   if (this.form.invalid) return;

//   this.api.forgot_password('forgot-password', this.form.value).subscribe({
//     next: (res: any) => {
//       Swal.fire('Success', res.message, 'success').then(() => {
//         // Store email temporarily in localStorage or service for the OTP page
//         localStorage.setItem('otp_email', this.form.value.email);
//         // Redirect to OTP login page
//         this.router.navigate(['/otp-login']);
//       });
//     },
//     error: err => {
//       if (err.status === 422 && err.error.errors) {
//         const errors = err.error.errors;
//         if (errors.email) {
//           this.form.controls['email'].setErrors({ server: errors.email[0] });
//         }
//       } else {
//         Swal.fire('Error', 'Something went wrong.', 'error');
//       }
//     }
//   });
// }
submit() {
  if (this.form.invalid) return;

  this.api.forgot_password('forgot-password', this.form.value).subscribe({
    next: (res: any) => {
      Swal.fire({
        title: 'Success',
        text: res.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(result => {
        if (result.isConfirmed) {
          // Store email temporarily
          localStorage.setItem('otp_email', this.form.value.email);
          // Redirect to OTP login page
          this.router.navigate(['/login-otp']);
        }
      });
    },
    error: err => {
      if (err.status === 422 && err.error.errors) {
        const errors = err.error.errors;
        if (errors.email) {
          this.form.controls['email'].setErrors({ server: errors.email[0] });
        }
      } else {
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  });
}

}
