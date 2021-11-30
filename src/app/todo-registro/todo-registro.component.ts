import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from "@angular/forms";
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from '../profesor';
import { Estudiante } from '../estudiante';

@Component({
  selector: 'app-todo-registro',
  templateUrl: './todo-registro.component.html',
  styleUrls: ['./todo-registro.component.css']
})
export class TodoRegistroComponent implements OnInit {

  todoForm: FormGroup;
  
  idProfesor:number= null;
  idEstudiante:number= null;

  message:string= null;

  datosForm:Profesor = null;

  estudiante: Estudiante = null;
 
  constructor(
    private formBuilder: FormBuilder, 
    private activeRouter: ActivatedRoute, 
    private router: Router, 
    private api: ApiService
  ) { }
 
  ngOnInit() {
     
    this.getDetail(this.activeRouter.snapshot.params['profesorId']);
 
    this.todoForm = this.formBuilder.group({
      id: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      cantidad: ['', Validators.compose([Validators.required])],
      cedulaEstudiante: ['', Validators.compose([Validators.required])],
      nombresEstudiante: [''],
      cursoEstudiante: [''],
    });
  }
 
  getDetail(id) {
    this.api.getTodo(id)
      .subscribe(data => {
        this.idProfesor = data.id;
        this.todoForm.setValue({
          id: data.id,
          nombre: data.nombre,
          cantidad: data.cantidad,
          cedulaEstudiante: '',
          nombresEstudiante: '',
          cursoEstudiante:'',
        });
        console.log(data);
      });
  }

  updateTodo(form:NgForm) { 
    this.api.updateTodo(this.idProfesor, form)
      .subscribe(res => {
          this.router.navigate(['/']);
        }, (err) => {
          console.log(err);
        }
      );
     
  }

  registrarProfesorEstudiante(form:NgForm) { 

    console.log(form);

    this.message = '';

    if (this.idProfesor == null) {
      this.message = 'Datos del profesor estan vacios';
      return;
    }

    if (this.idEstudiante == null) {
      this.message = 'Datos del estudiante estan vacios';
      return;
    }

    this.api.registrarProfesorEstudiante(this.idProfesor, this.idEstudiante, form)
      .subscribe(res => {
        console.log('response:');
        console.log(res);
          if (res != undefined) {
            if (res.error === 0) {
              this.router.navigate(['/']);
            } else {
              this.message = res.message;
            }
          } else {
            this.message = "ERROR: No se pudo procesar el registro solicitado.";
          }
        }, (err) => {
          console.log(err);
        }
      );     
  }

  buscarEstudianteByCedula() {

    this.message = '';

    console.log(this.todoForm.value);
    this.api.buscarEstudianteByCedula(this.idProfesor, this.todoForm.value)
      .subscribe(res => {
        console.log('response: ' + JSON.stringify(res));
        
        if (res != undefined) {
          if (res.error === 1) {
            this.message = res.mensaje;
          } else {
            if (res.estudiante != undefined) {
              this.estudiante = res.estudiante;
              this.idEstudiante= res.estudiante.id;
              console.log('this.estudiante: ' + JSON.stringify(this.estudiante));
              this.todoForm.patchValue({
                nombresEstudiante: res.estudiante.nombres,
                cursoEstudiante: res.estudiante.curso
              });
            } else {              
              this.message = res.mensaje;
              this.estudiante = null;
              this.idEstudiante= null;
              this.todoForm.patchValue({
                nombresEstudiante: '',
                cursoEstudiante: ''
              });
            }              
          }
        } else {
          this.message = "Error al buscar la cedula del estudiante";
        }
      }, (err) => {
        console.log(err);
      }
    ); 
  }

}
