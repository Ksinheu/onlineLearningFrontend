import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson',
  standalone: false,
  
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent {
  lessons: any[] = [];
  selectedLesson: any = null;
  hasPurchased: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getLessonById().subscribe({
      next: (res) => {
        this.lessons = res.lessons || [];
        // this.hasPurchased = res.hasPurchased || false;
        this.hasPurchased = true;
        // Auto-select first lesson
        if (this.lessons.length > 0) {
          this.selectedLesson = this.lessons[0];
        }
      },
      error: (err) => {
        console.error('Failed to fetch lessons', err);
      }
    });
  }

  selectLesson(lesson: any): void {
    this.selectedLesson = lesson;
  }

  goBack(): void {
    window.history.back();
  }

  // buyCourse(courseId: number): void {
  //   console.log('Buying course with ID:', courseId);
  //   this.hasPurchased = true;
  // }
}
