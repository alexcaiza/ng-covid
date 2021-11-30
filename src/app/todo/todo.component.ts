import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Todo } from '../todo';
import { Profesor } from '../profesor';
import { Estudiante } from '../estudiante';

import {NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { EstudianteVacuna } from '../EstudianteVacuna';
import { NotificationsService } from '../servicios/notifications.service';
import { ExcelService } from '../servicios/excel.service';

 
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
 
  data: Estudiante[] = [];
  estudianteVacuna: EstudianteVacuna;

  cedula: string;
  nombres: string;

  model: NgbDateStruct;
  date: {year: number, month: number};
  @ViewChild('dp') dp: NgbDatepicker;

  closeResult: string;
 
  constructor(private api: ApiService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private notifyService : NotificationsService,
    private excelService:ExcelService
    ) { }
   
 
  ngOnInit() {
    this.buscarEstudiantes(true);
  }

  buscarEstudiantes(showMessage:boolean) {
    
    this.api.getEstudiantes(this.cedula, this.nombres).subscribe(res => {
      console.log('response:', res);

      if (!res) {
        this.notifyService.showError("Error al consultar los estudiantes", "Mensaje")
        return;
      }

      this.data = res.estudiantes;
      console.log(res);
      
      if (showMessage) {
        this.notifyService.clear();
        if (this.data) {          
          this.notifyService.showSuccess("La busqueda de estudiantes se realizo correctamente", "Mensaje")
        } else {
          this.notifyService.showWarning(`No se encontraron estudiantes con la datos de busqueda ${this.nombres} ${this.cedula}`, "Mensaje");
        }
      }
    }, err => {
      console.log(err);
    });
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  setCurrent() {
    //Current Date
    this.dp.navigateTo()
  }
  setDate() {
    //Set specific date
    this.dp.navigateTo({ year: 2013, month: 2 });
  }

  navigateEvent(event) {
    this.date = event.next;
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'Reporte');
 }
 
  deleteTodo(id, index) {
    this.api.deleteTodo(id)
      .subscribe(res => {    
          this.data.splice(index,1);
        }, (err) => {
          console.log(err);
        }
      );
  }

  /**
   * Metodo para guardar los datos de una vacuna de un estudiante
   * @param params 
   */
  guardarEstudianteVacuna(params: any) {
    this.api.guardarEstudianteVacuna(params).subscribe(response => {
      console.log('response guardarEstudianteVacuna()');
      console.log(response);
      if (response != undefined) {
          if (response.error === 0) {
            this.notifyService.showSuccess('Los datos se registraron correctamente', 'Mensaje');

            this.buscarEstudiantes(false);

          } else {
            this.notifyService.showError(response.message, "Mensaje");
          }
      } else {
        this.notifyService.showError("A ocurrido un problema al registar los datos", "Mensaje");
      }
    }, (err) => {
      console.log(err);
    });
  }

  open(numeroVacuna, content, estudiante: Estudiante) {

    this.notifyService.clear();
    
    this.estudianteVacuna = new EstudianteVacuna;
    this.estudianteVacuna.numeroVacuna = numeroVacuna;
    this.estudianteVacuna.estudiante = estudiante
  

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then(
    (result) => {
      console.log('result', result);
      this.closeResult = `Closed with: ${result}`;

      let params = <any> {};
      if (this.estudianteVacuna.estaVacunado) {
        params.estavacunado = '1';
        params.numerovacuna = this.estudianteVacuna.numeroVacuna;
        
        // Verifica si ingreso la fecha de la vacuna
        if (this.model && this.model.year) {
          params.fechavacunacion = '' + this.model.year+"-" + this.model.month+"-" + this.model.day;
        } else {
          params.fechavacunacion = null;
        }
        
        params.codigoestudiante = this.estudianteVacuna.estudiante.codigoestudiante;

        this.guardarEstudianteVacuna(params);

      } else {
        this.notifyService.showError(`Seleccione si el estudiante esta vacunado`, 'Mensaje');
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}