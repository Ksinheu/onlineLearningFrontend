import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../Services/api.service';
// import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-invioce',
  standalone: false,
  templateUrl: './invioce.component.html',
  styleUrl: './invioce.component.css'
})
export class InvioceComponent {
 invoiceInfo: any = {};
completedCourses: any[] = [];
  pendingCourses: any[] = [];
  customerId!: number;
 loading = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.customerId = Number(localStorage.getItem('customer_id')); // assuming /invoice/:id route
    if (this.customerId) {
       this.loadCompletedCourses();
    }
   
  }

  loadCompletedCourses() {
    this.loading = true;
    this.apiService.getCompletedCourses(this.customerId).subscribe({
      next: res => {
        this.completedCourses = res.completed || [];
        console.log(this.completedCourses)
        this.pendingCourses = res.pending || [];
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load courses:', err);
        this.loading = false;
      }
    });
  }
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

printInvoice(): void {
  const printContents = this.invoiceSection.nativeElement.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // reload to restore Angular state
}
// downloadPDF(): void {
//   const element = this.invoiceSection.nativeElement;
//   const opt = {
//     margin:       0.5,
//     filename:     `invoice-${this.payment?.id}.pdf`,
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };
//   // html2pdf().from(element).set(opt).save();
// }
 goBack(): void {
    window.history.back();
  }
}
