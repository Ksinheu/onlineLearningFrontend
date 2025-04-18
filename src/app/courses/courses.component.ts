import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
   course: any[] = [];
  
    constructor(private newsService: ApiService) {}
  ngOnInit(): void {
    this.newsService.getCourse().subscribe((response) => {
      this.course = response.course; // Ensure response contains 'news' array
    }, (error) => {
      console.error('Error fetching news:', error);
    });
  }
}
