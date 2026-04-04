import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'] // ✅ matches your SCSS file
})
export class FeedbackComponent {

  studentName: string = '';
  studentEmail: string = '';
  message: string = '';
  rating: number = 5;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  submitFeedback() {
    console.log('Submit Feedback clicked ✅');

    const feedbackData = {
      studentName: this.studentName,
      studentEmail: this.studentEmail,
      message: this.message,
      rating: this.rating
    };

    this.http.post('http://localhost:8080/feedback/submit', feedbackData)
      .subscribe({
        next: () => {
          this.successMessage = '✅ Feedback submitted successfully!';
          this.errorMessage = '';

          // reset form
          this.studentName = '';
          this.studentEmail = '';
          this.message = '';
          this.rating = 5;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = '❌ Failed to submit feedback';
          this.successMessage = '';
        }
      });
  }
}
``