import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "@app/core/services/auth/auth.service";
// import { userFormGroup } from '@models/../forms/userForm.component';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadService } from "@app/core/services/upload/upload.service";
import { Upload } from "@app/shared/models/upload";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
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
      .subscribe((res: any) => {
        const userForm = {...this.userForm.value};
        if (res) {
          const fileDTO = res;
          this.isRegisterValid = true;
          if (fileDTO) {
            userForm.photoURL = fileDTO.url;
          }
        }
        // call signup
        this.signUp(userForm);
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
  signUp(userForm) {
    this.authService.signUp(userForm).subscribe(res => {
      this.activeModal.close();
    });
  }
  uploadFile(e) {
    this.file = new Upload(e.target.files.item(0));
    this.logger.info("files", this.file);
  }
  onSubmit() {
    // check form valid
    if (!this.userForm.valid) {
      return;
    }
    // check submit valid
    if (this.isSubmitted) {
      return;
    }
    this.isSubmitted = true;

    // if file exists, start upload.
    if (this.file) {
      this.uploadService.startUpload(this.file).subscribe(res => {
        this.isRegisterValid = false;
      });
    } else {
      const userForm = {...this.userForm.value};
      this.signUp(userForm);
    }
  }
  goToSignIn(e) {
    e.preventDefault();
    this.activeModal.close("SignIn");
  }
  ngOnDestroy() {
    this.uploadSubscription.unsubscribe();
  }
}
