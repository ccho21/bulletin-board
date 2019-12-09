import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../shared/post.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { Post } from "../../../shared/models/post";
import { Upload } from '@app/shared/models/upload';
import { Subscription } from 'rxjs';
import { UploadService } from '@app/core/services/upload/upload.service';
@Component({
  selector: "app-post-new",
  templateUrl: "./post-new.component.html",
  styleUrls: ["./post-new.component.scss"]
})
export class PostNewComponent implements OnInit, OnDestroy {
  post: Post;
  postFormGroup: FormGroup;
  file: Upload;
  isSubmitted: boolean;
  uploadSubscription: Subscription;
  isRegisterValid: boolean;
  postDTO: Post;
  basePhoto: string = `https://firebasestorage.googleapis.com/v0/b/bulletin-board-d1815.appspot.com/o/uploads%2F1575514437441_temp-main4.jpg?alt=media&token=044f04f0-89cd-4027-865e-eb6680ad008b`; 
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private authService: AuthService,
    private uploadService: UploadService
  ) {
    // subscribing to check uploading file and POST to DB is completed
    this.uploadSubscription = this.uploadService
      .getUploadStatus()
      .subscribe((res: any) => {
        if (res) {
          const fileDTO = res;
          this.isRegisterValid = true;
          if (fileDTO) {
            this.postDTO.photoURL = fileDTO.url;
          }
        }
        this.postService.addPost(this.postDTO).subscribe(res => {
          this.logger.info('### successfully posted data', res);
        })
      });
  }

  ngOnInit() {
    this.postFormGroup = new FormGroup({
      title: new FormControl(''),
      photoURL: new FormControl(''),
      content: new FormControl('')
    });
    this.logger.info(this.postFormGroup);
  }
  uploadFile(e) {
    this.file = new Upload(e.target.files.item(0));
    this.logger.info("files", this.file);
  }
  onSubmit() {
    if (!this.postFormGroup.valid) {
      return;
    }

    // check submit valid
    if (this.isSubmitted) {
      return;
    }

    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const author: User = { displayName, uid, photoURL, email, emailVerified };
    const postDTO: Post = { ...this.postFormGroup.value, author, createdAt: new Date().toISOString(), likes: [], comments: [], views: 0 };
    this.logger.info('###  post', postDTO);
    this.postDTO = postDTO;

    // if file exists, start upload.
    if (this.file) {
      this.uploadService.startUpload(this.file).subscribe(res => {
        this.isRegisterValid = false;
      });
    } else {
      postDTO.photoURL = this.basePhoto;
      this.postService.addPost(postDTO).subscribe(res => {
        this.logger.info('### successfully posted data', res);
      })
    }
  }
  ngOnDestroy() {
    if(this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}
