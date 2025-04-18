import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-lesson',
  standalone: false,
  
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent {
lesson: any[]=[];
hasPurchased = false; // Set this from API or route guard
constructor(private apiService:ApiService){}
ngOnInit(): void {
  this.apiService.getLesson().subscribe((response) => {
    this.lesson = response.lesson; // Ensure response contains 'news' array
  }, (error) => {
    console.error('Error fetching news:', error);
  });
}


buyCourse(courseId: number) {
  // Call your purchase API here
  console.log('Buying course with ID:', courseId);
  // On success:
  this.hasPurchased = true;
}
}
