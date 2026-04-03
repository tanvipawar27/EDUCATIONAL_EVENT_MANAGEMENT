import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss']
})
export class ViewStudentsComponent implements OnInit {
  students: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.httpService.getAllUsers().subscribe({
      next: (res: any[]) => {
        // ✅ filter only STUDENT role
        this.students = res.filter(u => u.role === 'STUDENT' || u.role==='student');
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Failed to load students.';
        this.loading = false;
      }
    });
  }
}
