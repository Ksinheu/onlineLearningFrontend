import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson',
  standalone: false,
  
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent {
//   lessons: any[] = [];
//   exercise:any[]=[];
//   selectedLesson: any = null;
//   hasPurchased: boolean = false;

//   constructor(private apiService: ApiService) {}

//   ngOnInit(): void {
//     this.apiService.getLessonById().subscribe({
//       next: (res) => {
//         this.lessons = res.lessons || [];
//         // this.hasPurchased = res.hasPurchased || false;
//         this.hasPurchased = true;
//         // Auto-select first lesson
//         if (this.lessons.length > 0) {
//           this.selectedLesson = this.lessons[0];
//         }
//       },
//       error: (err) => {
//         console.error('Failed to fetch lessons', err);
//       }
//     });
//     this.loadExercise();
//   }
// loadExercise(): void {
//     this.apiService.getExercise().subscribe({
//       next: (response) => {
//         this.exercise = response.exercise;
//       },
//       error: (error) => {
//         console.error('Failed to load exercise:', error);
//       }
//     });
//   }
//   selectLesson(lesson: any): void {
//     this.selectedLesson = lesson;
//   }

//   goBack(): void {
//     window.history.back();
//   }
  lessons: any[] = [];
  exercise: any[] = [];
  selectedLesson: any = null;
  hasPurchased: boolean = true;
  contents: any[] = [];

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getLessonById().subscribe({
      next: (res) => {
        this.lessons = res.lessons || [];
        if (this.lessons.length > 0) {
          this.selectedLesson = this.lessons[0];
          this.loadExercise(); // Load exercise for first lesson
        }
      },
      error: (err) => {
        console.error('Failed to fetch lessons', err);
      }
    });
    this.loadContents();
  }

  selectLesson(lesson: any): void {
    this.selectedLesson = lesson;

    // Reload video
    setTimeout(() => {
      const video = this.videoPlayer?.nativeElement;
      if (video) {
        video.pause();
        video.load();
        video.play(); // Optional
      }
    });

    // Reload exercises
    this.loadExercise();
    
  }

  loadExercise(): void {
    if (!this.selectedLesson) return;

    this.apiService.getExercise(this.selectedLesson.id).subscribe({
      next: (response) => {
        this.exercise = response.exercise;
      },
      error: (error) => {
        console.error('Failed to load exercise:', error);
        this.exercise = [];
      }
    });
  }
 loadContents(): void {
    this.apiService.getContents().subscribe({
      next: (response) => {
        this.contents = response.content;
      },
      error: (error) => {
        console.error('Failed to load content:', error);
      }
    });
  }
  goBack(): void {
    window.history.back();
  }
}
