
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-educators',
  templateUrl: './view-educators.component.html',
  styleUrls: ['./view-educators.component.scss']
})
export class ViewEducatorsComponent implements OnInit {
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
        this.students = res.filter(u => u.role === 'EDUCATOR' || u.role==='educator');
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
