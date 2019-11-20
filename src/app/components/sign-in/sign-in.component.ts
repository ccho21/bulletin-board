import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { throwError, from } from 'rxjs';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private logger                      : LoggerService,
    private authService                 : AuthService,
    private router                      : Router,
    private activeModal                 : NgbActiveModal,
    
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
        this.logger.info('Sign in status', res);
        if(res) {
          this.close();
        }
      }, err => {
        window.alert(err);
      });
    }
  }

  goToSignUp(e){
    e.preventDefault();
    this.activeModal.close('SignUp');
  }
  goToLink(e){
    e.preventDefault();
    // this.close();
    this.router.navigateByUrl('/forgot-password');
  }
 
  close(link?: string) {
    this.activeModal.close();
  }

}
