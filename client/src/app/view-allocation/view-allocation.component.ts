import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-allocation',
  templateUrl: './view-allocation.component.html',
  styleUrls: ['./view-allocation.component.scss']
})
export class ViewAllocationComponent implements OnInit {
  allocations: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getAllocations();
  }

  getAllocations() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => {
        this.allocations = res;
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load allocations.';
        console.error(err);
      }
    });
  }
}
