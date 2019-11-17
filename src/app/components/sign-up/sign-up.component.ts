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
  fileDTO;
  isRegisterValid: boolean = true;
  isSubmitted: boolean = false;
  uploadSubscription: Subscription;
  constructor(
    public authService: AuthService,
    private logger: LoggerService,
    public activeModal: NgbActiveModal,
    private uploadService: UploadService
  ) {
    // subscribing to check uploading file and POST to DB is completed
    this.uploadSubscription = this.uploadService
      .getUploadStatus()
      .subscribe(res => {
        if (res) {
          this.fileDTO = res;
          this.isRegisterValid = true;
          if (this.fileDTO) {
            this.logger.info('### fileDTO', this.fileDTO);
          }
        }
      });
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      uid: new FormControl(''),
      email: new FormControl(''),
      photoURL: new FormControl(''),
      emailVerified: new FormControl(''),
      displayName: new FormControl(''),
      password: new FormControl('')
    });
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
    const userForm = this.userForm.value;
    if (!this.userForm.valid) {
      return;
    }
    if (this.isSubmitted) {
      return;
    }
    if (this.fileDTO) {
      userForm.photoURL = this.fileDTO.url;
    } else {
      return;
    }
    this.authService.signUp(userForm);
    this.isSubmitted = true;
  }
  ngOnDestroy() {
    this.uploadSubscription.unsubscribe();
  }
}
