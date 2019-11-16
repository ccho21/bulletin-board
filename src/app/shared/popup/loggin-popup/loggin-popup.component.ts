import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '@app/core/services/logger/logger.service';

@Component({
  selector                              : 'app-loggin-popup',
  templateUrl                           : './loggin-popup.component.html',
  styleUrls                             : ['./loggin-popup.component.scss']
})
export class LogginPopupComponent implements OnInit {
  focus;
  focus1;
  test                                  : Date = new Date();
  constructor(
    public activeModal                  : NgbActiveModal,
    private logger                      : LoggerService,
  ) {}
  ngOnInit() {
  }
  
}
