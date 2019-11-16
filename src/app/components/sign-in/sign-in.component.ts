import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  focus;
  focus1;
  test                                  : Date = new Date();
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
}
