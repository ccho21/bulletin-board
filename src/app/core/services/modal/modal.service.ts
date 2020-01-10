import { Injectable, OnDestroy } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MatDialog } from '@angular/material';

import { from, of, Observable, Subject } from 'rxjs';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';
import { AuthService } from '../auth/auth.service';

import { PostModalComponent } from '@app/containers/posts/post-modal/post-modal.component';
import { PostDetailComponent } from '@app/containers/posts/post-detail/post-detail.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog = null;
  constructor(
    private logger: LoggerService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private matDialog: MatDialog
  ) { }
  // SIGN IN
  signInOpen() {
    this.logger.info('sign in open ');
    const modalRef = this.modalService.open(SignInComponent).result;
    from(modalRef).subscribe(res => {
      this.logger.info('### modal result ', res);
      if (res === 'SignUp') {
        this.activeModal.close();
        this.signUpOpen();
        return;
      }
      if (res && res !== 'SignUp') {
        this.activeModal.close();
        this.authService.updateSignInSource(true);
      }
    });
  }
  signUpOpen() {
    this.logger.info('sign up open ');
    const modalRef = this.modalService.open(SignUpComponent, { size: 'lg' })
      .result;
    from(modalRef).subscribe(res => {
      this.logger.info('### modal result ', res);
      if (res === 'SignIn') {
        this.activeModal.close();
        this.signInOpen();
      }
      if (res && res !== 'SignIn') {
        this.authService.updateSignInSource(true);
      }
      this.close();
    });
  }
  goToSignUp(e) {
    e.preventDefault();
    this.close();
    this.signUpOpen();
  }
  close() {
    this.activeModal.close();
  }
  open(component) {
    const modalRef = this.modalService.open(component).result;
    of(modalRef).subscribe(res => {
      this.logger.info('### modal result ', res);
    });
  }
  openVerticallyCentered(component) {
    const modalRef = this.modalService.open(component, { scrollable: true, centered: true }).result;
    return of(modalRef);
  }

  openSmallCentered(component) {
    const modalRef = this.modalService.open(component, { scrollable: true, centered: true, size: 'sm' }).result;
    return of(modalRef);
  }
/*
  postDetailPopup(postId) {
    let dialogRef: MatDialogRef<PostDetailComponent>;
    this.logger.info('##### postId', postId);
    dialogRef = this.matDialog.open(PostDetailComponent, {
      width: '1140px',
      height: '600px',
      data: { id: postId }
    });
    dialogRef.componentInstance.postId = postId;
    return dialogRef.afterClosed();
  }
 */
  ngOnDestroy() {
    this.destroy.next();
  }
}
