import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  sendVerificationMail() {
    this.authService.sendVerificationMail();
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
  getUserData() {
    return this.authService.userData;
  }
}
