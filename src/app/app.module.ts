import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { TodoComponent } from './todo/todo.component';
import { TodoAddComponent } from './todo-add/todo-add.component';
import { TodoEditComponent } from './todo-edit/todo-edit.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRegistroComponent } from './todo-registro/todo-registro.component';
import { ReporteComponent } from './reporte/reporte.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
import { LoaderService } from './servicios/loader.service';
import { LoaderInterceptorService } from './interceptors/loader-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoAddComponent,
    TodoEditComponent,
    TodoRegistroComponent,
    ReporteComponent,
    MyLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
