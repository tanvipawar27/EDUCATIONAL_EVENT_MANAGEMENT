import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-resources',
  templateUrl: './view-resources.component.html',
  styleUrls: ['./view-resources.component.scss']
})
export class ViewResourceComponent implements OnInit {
  resourceList: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getResources();
  }

  getResources() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => { this.resourceList = res; },
      error: (err: any) => { console.error(err); }
    });
  }
}
