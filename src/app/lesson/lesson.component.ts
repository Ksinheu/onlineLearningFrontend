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
  lesson: any;
  hasPurchased = false;


  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
  // this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.apiService.getLessonById().subscribe({
     next: (res) => {
    this.lesson = res.lessons; // <- match key!
  }
     
  });
}

  buyCourse(courseId: number): void {
    console.log('Buying course with ID:', courseId);
    // Call actual purchase API here
    this.hasPurchased = true;
  }
}
