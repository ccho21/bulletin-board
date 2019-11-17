import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';
// import { userFormGroup } from '@models/../forms/userForm.component';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from '@app/core/services/upload/upload.service';
import { Upload } from '@app/shared/models/upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  file: Upload;
  isRegisterValid: boolean = true;

  uploadSubscription: Subscription;
  constructor(
    public authService: AuthService,
    private logger: LoggerService,
    public activeModal: NgbActiveModal,
    private uploadService: UploadService
  ) {
    this.uploadSubscription = this.uploadService.getUploadStatus().subscribe(res => {
      this.logger.info(res);
      if(res) {
        this.isRegisterValid = true;
      }
    });
  }

  ngOnInit() {

    this.userForm = new FormGroup({
      uid: new FormControl(''),
      email: new FormControl(''),
      photoURL: new FormControl(''),
      emailVerified: new FormControl(''),
      fullName: new FormControl(''),
      password: new FormControl('')
    });
    this.logger.info(this.userForm);
  }

  uploadFile(e) {
    this.file = new Upload(e.target.files.item(0));
    this.logger.info('files', this.file);
    if (this.file) {
      this.uploadService.startUpload(this.file).subscribe(res => {
        this.logger.info('###', res);
        this.isRegisterValid = false;
      });
    }
  }
  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }
    this.logger.info('## userForm', this.userForm);

    this.authService.SignUp(null, null);
  }
  ngOnDestroy () {
    this.uploadSubscription.unsubscribe();
  }
}
