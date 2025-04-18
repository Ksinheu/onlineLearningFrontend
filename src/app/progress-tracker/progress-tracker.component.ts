import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-tracker',
  standalone: false,
  
  templateUrl: './progress-tracker.component.html',
  styleUrl: './progress-tracker.component.css'
})
export class ProgressTrackerComponent {
  progressList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProgress();
  }

  fetchProgress() {
    this.http.get('http://127.0.0.1:8000/api/progress').subscribe((data: any) => {
      this.progressList = data;
    });
  }

  markAsCompleted(id: number) {
    this.http.patch(`http://127.0.0.1:8000/api/progress/${id}`, {}).subscribe(() => {
      this.fetchProgress();
    });
  }

  deleteProgress(id: number) {
    this.http.delete(`http://127.0.0.1:8000/api/progress/${id}`).subscribe(() => {
      this.fetchProgress();
    });
  }
}
