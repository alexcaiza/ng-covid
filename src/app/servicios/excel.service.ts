import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReporteEstudianteModule } from '../models/reporte-estudiante/reporte-estudiante.module';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    let jsonReporte = this.armarDataReporte(json);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonReporte);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  armarDataReporte(json: any[]) : ReporteEstudianteModule[] {
    let datos =new Array();
    json.forEach(element => {
      let ele = new ReporteEstudianteModule();
      if (element.nombres) {
        ele.Nombre = element.nombres;
      }
      if (element.cedula) {
        ele.Cedula = element.cedula;
      }
      if (element.curso) {
        ele.Curso = element.curso;
      }
      if (element.paralelo) {
        ele.Paralelo = element.paralelo;
      }
      if (element.vacuna1) {
        ele.Vacuna1 = 'Si';
      } else {
        ele.Vacuna1 = 'No';
      }
      if (element.vacuna2) {
        ele.Vacuna2 = 'Si';
      } else {
        ele.Vacuna2 = 'No';
      }
      if (element.vacuna3) {
        ele.Vacuna3 = 'Si';
      } else {
        ele.Vacuna3 = 'No';
      }

      datos.push(ele);

    });

    console.log('datos', datos);

    return datos;
  }

}
