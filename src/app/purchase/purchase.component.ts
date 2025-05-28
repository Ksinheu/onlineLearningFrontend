// import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { ApiService } from '../Services/api.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OrderService  } from '../Services/order.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import Swal from 'sweetalert2';
// import { environment } from '../guards/environment';
// import { isPlatformBrowser } from '@angular/common';



// @Component({
//   selector: 'app-purchase',
//   standalone: false,
  
//   templateUrl: './purchase.component.html',
//   styleUrl: './purchase.component.css'
// })
// export class PurchaseComponent implements OnInit{
// //   purchaseForm: FormGroup;
// //   course: any;
// //   payment_methods: any[] = [];
// //   selectedPaymentMethod: any = null;
// //   isSubmitting = false;
// //   loading = true;
//   // username: string | null = '';
// // errorMessage: string | null = null;
// //  successMessage: string | null = null;
// //   customers: any[] = [];
// //   apiUrl = environment.apiUrl;
// purchaseForm: FormGroup;
//   course: any | null = null;
//   payment_methods: any = [];
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   isSubmitting = false;
//   showModal = false;
//   loading = true;
//   apiUrl = environment.apiUrl;
// constructor(private fb: FormBuilder,private apiService:ApiService,private orderService:OrderService, private route:ActivatedRoute,
//    @Inject(PLATFORM_ID) private platformId: Object
// ){
//   this.purchaseForm = this.fb.group({
//       pay_slip: ['', Validators.required]
//     });
// }

//   ngOnInit(): void {
//     const courseId = this.route.snapshot.paramMap.get('id');
//     // this.username = localStorage.getItem('username');
    
//     // if (this.username) {
//     //   this.purchaseForm.patchValue({ customer_id: this.username });
//     // }

//     if (courseId) {
//        const numericCourseId = +courseId; // Convert to number safely
//       this.apiService.getCourseById(numericCourseId).subscribe({
//         next: res => {
//           this.course = res.course;
//           this.purchaseForm.patchValue({ course_id: this.course.id });
//           this.loading = false;
//         },
//         error: err => {
//           console.error('Failed to load course:', err);
//           this.loading = false;
//         }
//       });
//     }
 
//     this.apiService.getPaymentMethod().subscribe({
//       next: (response) => {
//         this.payment_methods = response['Payment method'];
//       },
//       error: (error) => {
//         console.error('Error fetching payment methods:', error);
//       }
//     });

//     // Set customer_id from localStorage
//     if (isPlatformBrowser(this.platformId)) {
//       const customerId = localStorage.getItem('customer_id');
//       if (customerId) {
//         this.purchaseForm.patchValue({ customer_id: Number(customerId) });
//       } else {
//         this.errorMessage = 'Please log in to proceed';
//       }
//     }
//   }


//   onFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
//       if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
//         this.purchaseForm.get('pay_slip')?.setErrors({ invalidType: true });
//         return;
//       }
//       if (file.size > 2048 * 1024) {
//         this.purchaseForm.get('pay_slip')?.setErrors({ maxSize: true });
//         return;
//       }
//       // Convert file to base64
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64 = (reader.result as string).split(',')[1]; // Remove data:image/...;base64,
//         this.purchaseForm.get('pay_slip')?.setValue(base64);
//       };
//       reader.readAsDataURL(file);
//     }
//   }
// openModal(): void {
//     this.showModal = true;
//   }

//   closeModal(): void {
//     this.showModal = false;
//   }
//   onSubmit(): void {
//     if (this.purchaseForm.invalid) {
//       this.purchaseForm.markAllAsTouched();
//       if (isPlatformBrowser(this.platformId)) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Invalid Form',
//           text: 'Please upload a valid payment slip.',
//           confirmButtonText: 'OK'
//         });
//       }
//       return;
//     }

//     this.isSubmitting = true;
//     this.successMessage = null;
//     this.errorMessage = null;

//     let customerId: number | null = null;
//     if (isPlatformBrowser(this.platformId)) {
//       customerId = Number(localStorage.getItem('customer_id'));
//     }
//     const courseId = Number(this.route.snapshot.paramMap.get('id'));
//     const { pay_slip } = this.purchaseForm.value;

//     if (!customerId) {
//       if (isPlatformBrowser(this.platformId)) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Login Required',
//           text: 'Please log in to proceed with the purchase.',
//           confirmButtonText: 'OK'
//         });
//       }
//       this.errorMessage = 'Please log in to proceed';
//       this.isSubmitting = false;
//       return;
//     }

//     // Log payload for debugging
//     console.log('Submitting purchase:', { customer_id: customerId, course_id: courseId, pay_slip });

//     this.orderService.submitPurchase(customerId, courseId, pay_slip).subscribe({
//       next: (response) => {
//         if (isPlatformBrowser(this.platformId)) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Purchase Submitted',
//             text: `${response.message}. Your lesson access is pending approval.`,
//             confirmButtonText: 'OK'
//           });
//         }
//         this.purchaseForm.reset();
//         this.isSubmitting = false;
//         this.closeModal();
//       },
//       error: (error) => {
//         let errorText = error.message;
//         if (error.status === 422 && error.error.errors) {
//           errorText = Object.values(error.error.errors).flat().join(' ');
//         }
//         if (isPlatformBrowser(this.platformId)) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Submission Failed',
//             text: errorText,
//             confirmButtonText: 'OK'
//           });
//         }
//         this.errorMessage = errorText;
//         this.isSubmitting = false;
//         console.error('Submission error:', error);
//       }
//     });
//   }

//   hasError(field: string): boolean {
//     const control = this.purchaseForm.get(field);
//     return !!control && control.touched && control.invalid;
//   }


// }



import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../Services/api.service';
import { environment } from '../guards/environment';
import Swal from 'sweetalert2';
import { OrderService } from '../Services/order.service';
import { isBrowser } from '../utils/platform.util';

@Component({
 selector: 'app-purchase',
  standalone: false,
  
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {
  purchaseForm: FormGroup;
  isLogined: boolean = false;
  course: any | null = null;
  payment_methods: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting = false;
  showModal = false;
  loading = true;
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.purchaseForm = this.fb.group({
      customer_id: ['', Validators.required],
      course_id: ['', Validators.required],
      pay_slip: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
       const numericCourseId = +courseId; // Convert to number safely
      this.apiService.getCourseById(numericCourseId).subscribe({
        next: res => {
          this.course = res.course;
          this.purchaseForm.patchValue({ course_id: this.course.id });
          this.loading = false;
        },
        error: err => {
          console.error('Failed to load course:', err);
          this.loading = false;
        }
      });
    }
 // Set course_id in form
      this.purchaseForm.patchValue({ course_id: courseId });
    this.apiService.getPaymentMethod().subscribe({
      next: (response) => {
        this.payment_methods = response['Payment method'];
      },
      error: (error) => {
        console.error('Error fetching payment methods:', error);
      }
    });
this.checkLoginStatus();
  }

  openModal(): void {
    if (!this.isLogined) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to proceed with the purchase.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    this.showModal = true;
    // this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.purchaseForm.get('pay_slip')?.setErrors({ invalidType: true });
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'Only JPG, JPEG, or PNG files are allowed.',
            confirmButtonText: 'OK'
          });
        }
        return;
      }
      if (file.size > 2048 * 1024) {
        this.purchaseForm.get('pay_slip')?.setErrors({ maxSize: true });
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File must not exceed 2MB.',
            confirmButtonText: 'OK'
          });
        }
        return;
      }
      if (file.size === 0) {
        this.purchaseForm.get('pay_slip')?.setErrors({ emptyFile: true });
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: 'error',
            title: 'Empty File',
            text: 'The uploaded file is empty.',
            confirmButtonText: 'OK'
          });
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        if (!base64) {
          this.purchaseForm.get('pay_slip')?.setErrors({ invalidBase64: true });
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid File',
              text: 'Failed to process the file.',
              confirmButtonText: 'OK'
            });
          }
          return;
        }
        this.purchaseForm.get('pay_slip')?.setValue(base64);
      };
      reader.readAsDataURL(file);
    }
  }
  private checkLoginStatus() {
    if (isBrowser()) {
      const token = localStorage.getItem('token'); // Use consistent key 'token'
      this.isLogined = !!token;
      // No need to redirect here, wait until user clicks "Buy"
    }
  }
  onSubmit(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      if (this.isLogined) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Form',
          text: 'Please ensure all required fields are valid.',
          confirmButtonText: 'OK'
        });
      }
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { customer_id, course_id, pay_slip } = this.purchaseForm.value;

    if (!customer_id || !course_id) {
      if (this.isLogined) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Data',
          text: 'Customer or course information is missing.',
          confirmButtonText: 'OK'
        });
      }
      this.errorMessage = 'Customer or course information is missing';
      this.isSubmitting = false;
      return;
    }

    console.log('Submitting purchase:', { customer_id, course_id, pay_slip });

    this.orderService.submitPurchase(customer_id, course_id, pay_slip).subscribe({
      next: (response) => {
        if (this.isLogined) {
          Swal.fire({
            icon: 'success',
            title: 'Purchase Submitted',
            text: `${response.message}. Your lesson access is pending approval.`,
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        }
        this.purchaseForm.reset();
        this.isSubmitting = false;
        this.closeModal();
      },
      error: (error) => {
        let errorText = error.message;
        if (error.status === 422 && error.error.errors) {
          errorText = Object.values(error.error.errors).flat().join(' ');
        }
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorText,
            confirmButtonText: 'OK'
          });
        }
        this.errorMessage = errorText;
        this.isSubmitting = false;
        console.error('Submission error:', error);
      }
    });
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  hasError(field: string): boolean {
    const control = this.purchaseForm.get(field);
    return !!control && control.touched && control.invalid;
  }
}