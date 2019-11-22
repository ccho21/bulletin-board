import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "@app/core/services/auth/auth.service";
// import { userFormGroup } from '@models/../forms/userForm.component';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadService } from "@app/core/services/upload/upload.service";
import { Upload } from "@app/shared/models/upload";
import { Subscription, Observable } from "rxjs";
import { mergeMap, tap, finalize } from "rxjs/operators";
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
      .subscribe(res => {
        if (res) {
          this.fileDTO = res;
          this.isRegisterValid = true;
          if (this.fileDTO) {
            this.logger.info("### fileDTO", this.fileDTO);
          }
        }
      });
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      uid: new FormControl(""),
      email: new FormControl(""),
      photoURL: new FormControl(""),
      emailVerified: new FormControl(""),
      displayName: new FormControl(""),
      password: new FormControl("")
    });
  }

  uploadFile(e) {
    this.file = new Upload(e.target.files.item(0));
    this.logger.info("files", this.file);
  }
  onSubmit() {
    const userForm = this.userForm.value;
    let fileRequest: Observable<any>;
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
    if (this.file) {
      fileRequest = this.uploadService.startUpload(this.file).pipe(
        tap(res => {
          return res;
        }),
        finalize(async () => {
          const { ref, path } = this.uploadService.getFilePathRef(this.file);
          const downloadURL = await ref.getDownloadURL().toPromise();
          const fileDTO = {
            path: path,
            url: downloadURL,
            name: this.file.file.name,
            createdAt: this.file.createdAt.toISOString()
          };
          this.uploadService.createProfile(fileDTO);
          this.isRegisterValid = false;
          this.activeModal.close();
          this.authService.signUp(userForm).subscribe(res => {});
        })
      );
    }
    fileRequest
      .pipe(
        tap(res => {
          return res;
        }),
        finalize(() => {
          this.authService.signUp(userForm).subscribe(res => {
            this.logger.info(res);
            this.activeModal.close();
          })
        })
      ).subscribe();
    this.isSubmitted = true;
  }
  goToSignIn() {
    this.activeModal.close("SignIn");
  }
  ngOnDestroy() {
    this.uploadSubscription.unsubscribe();
  }
}
