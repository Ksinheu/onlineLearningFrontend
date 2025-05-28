import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';



@Component({
  selector: 'app-payment-method',
  standalone: false,
  
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent implements OnInit{
   paymentMethods: any[] = [];
  selectedMethod: any = null;
  constructor(private apiService:ApiService){}
ngOnInit(): void {
  this.apiService.getPaymentMethod().subscribe({
    next: (response) => {
      console.log('API response:', response); // See actual response structure
      this.paymentMethods = response['Payment method']; // Adjust this if the key is different
    },
    error: (error) => {
      console.error('Error fetching payment methods:', error); // Check what error is printed
    }
  });
}
// openModal(method: any): void {
//     this.selectedMethod = method;
//     const modal = new bootstrap.Modal(document.getElementById('uploadModal')!);
//     modal.show();
//   }

}
