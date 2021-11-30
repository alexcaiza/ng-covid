import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toastr: ToastrService) { }
  
  showSuccess(message, title){
      this.toastr.success(message, title, {
        timeOut: 10000, 
        positionClass: 'toast-bottom-center', 
        closeButton: true
      });
  }
  
  showError(message, title){
      this.toastr.error(message, title, {
        timeOut: 10000, 
        positionClass: 'toast-bottom-center', 
        closeButton: true
      });
  }
  
  showInfo(message, title){
      this.toastr.info(message, title, {
        timeOut: 10000, 
        positionClass: 'toast-bottom-center', 
        closeButton: true
      });
  }
  
  showWarning(message, title){
      this.toastr.warning(message, title, {
        timeOut: 10000, 
        positionClass: 'toast-bottom-center', 
        closeButton: true
      });
  }

  clear(){
    this.toastr.clear();
  }
}
