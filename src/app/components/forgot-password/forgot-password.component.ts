import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  focus
  constructor(
    public authService: AuthService
  ) { }
    email: FormControl;
  ngOnInit() {
    this.email = new FormControl('');
  }

}
