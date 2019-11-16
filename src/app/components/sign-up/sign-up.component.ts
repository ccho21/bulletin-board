import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';
// import { userFormGroup } from '@models/../forms/userForm.component';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector                : 'app-sign-up',
  templateUrl             : './sign-up.component.html',
  styleUrls               : ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  userForm                : FormGroup;
  constructor(
    public authService    : AuthService,
    private logger        : LoggerService,
    public activeModal    : NgbActiveModal
  ) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      uid                 : new FormControl(''),
      email               : new FormControl(''),
      nickname            : new FormControl(''),
      photoURL            : new FormControl(''),
      emailVerified       : new FormControl(''),
      firstName           : new FormControl(''),
      lastName            : new FormControl('')
    });
    this.logger.info(this.userForm);
  }
  onSubmit() {
    this.logger.info('this?');
    if (!this.userForm.valid) {
      return;
    }
    this.authService.SignUp(null, null);
  }
}
