import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
   course: any[] = [];
  loading = true;
    constructor(private apiService: ApiService,private router:Router) {}
  ngOnInit(): void {
    this.apiService.getCourse().subscribe((response) => {
      this.course = response.course; // Ensure response contains 'news' array
      this.loading = false;
    }, (error) => {
      console.error('Error fetching news:', error);
      this.loading = false;
    });
  }
  onBuy(courseId: number) {
    this.apiService.isLoggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/purchase', courseId]);
      } else {
        Swal.fire({
          title: 'សូមចុះឈ្មោះ!',
          text: 'សូមចុះឈ្មោះមុនពេលទិញវគ្គសិក្សា។',
          icon: 'warning',
          confirmButtonText: 'ទៅកាន់ការចុះឈ្មោះ',
          showCancelButton: true,
          cancelButtonText: 'បោះបង់'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/signup']);
          }
        });
      }
    });
  }
  
}
