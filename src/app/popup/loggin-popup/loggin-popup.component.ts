import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-loggin-popup',
  templateUrl: './loggin-popup.component.html',
  styleUrls: ['./loggin-popup.component.scss']
})
export class LogginPopupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
  constructor() { }

  ngOnInit() {
    
  }

}
