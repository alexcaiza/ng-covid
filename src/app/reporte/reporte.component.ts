import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  data: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getReporte().subscribe(res => {
        if (res.data) {
          this.data = res.data;
        }  
      }, err => {
        console.log(err);
      });
  }

}
