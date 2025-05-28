
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
 paymentForm: FormGroup;
  selectedFile: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private paymentService: ApiService) {
    this.paymentForm = this.fb.group({
      customer_id: ['', Validators.required],
      course_id: ['', Validators.required],
      pay_slip: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (!this.paymentForm.valid || !this.selectedFile) {
      this.errorMessage = 'Please fill all fields and select a valid file.';
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', this.paymentForm.get('customer_id')?.value);
    formData.append('course_id', this.paymentForm.get('course_id')?.value);
    formData.append('pay_slip', this.selectedFile);

    this.paymentService.uploadPaySlip(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.paymentForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Upload failed';
        this.successMessage = '';
      }
    });
  }
}
