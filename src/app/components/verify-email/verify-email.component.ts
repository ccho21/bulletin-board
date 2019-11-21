import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '@app/core/services/modal/modal.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }
  sendVerificationMail() {
    this.authService.sendVerificationMail();
  }
  goBack(signIn?: boolean) {
    if(signIn) {
      this.authService.signOut();
      this.modalService.signInOpen();
    }
    this.router.navigateByUrl('/');
  }
  getUserData() {
    return this.authService.userData;
  }
}
