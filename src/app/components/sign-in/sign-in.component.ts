import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  focus;
  focus1;
  test                                  : Date = new Date();
  password = new FormControl('');
  email = new FormControl('');
  constructor(
    public activeModal                  : NgbActiveModal,
    private logger                      : LoggerService,
    private authService                 : AuthService,
    
  ) {}
  ngOnInit() {
  }
  googleAuth () {
    this.authService.GoogleAuth();
  }
  signin() {
    const email = this.email.value;
    const password = this.password.value;
    if(email && password){
      this.logger.info(email, password);
      this.authService.signIn(email, password).subscribe(res => {
        this.logger.info(res);
        if(res) {
          this.close(true);
        }
      }, err => {
        window.alert(err);
      });
    }
  }
  close(valid?: boolean) {

    this.activeModal.close(valid);
  }
}
