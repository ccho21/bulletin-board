import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../../../core/services/post/post.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { Post } from '../../../shared/models/post';
import { Upload } from '@app/shared/models/upload';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { UploadService } from '@app/core/services/upload/upload.service';
import { Router } from '@angular/router';
import { PostStateService } from '../post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.scss']
})
export class PostNewComponent implements OnInit, OnDestroy {
  post: Post;
  postFormGroup: FormGroup;
  file: Upload;
  files: Upload[] = [];
  isSubmitted: boolean;
  uploadSubscription: Subscription;
  isRegisterValid: boolean;
  postDTO: Post;
  basePhoto = `https://firebasestorage.googleapis.com/v0/b/bulletin-board-d1815.appspot.com
  /o/uploads%2F1575514437441_temp-main4.jpg?alt=media&token=044f04f0-89cd-4027-865e-eb6680ad008b`;
  filesStatus: Array<boolean> = [];
  photoUrls: Array<string> = [];
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router,
    private postStateService: PostStateService,
  ) {
    // subscribing to check uploading file and POST to DB is completed
    this.uploadSubscription = this.uploadService
      .getUploadStatus()
      .subscribe((res: any) => {
        this.logger.info('### subject from upload service ', res);
        if (res) {
          this.filesStatus.push(true);
          const fileDTO = res;
          this.photoUrls.push(fileDTO.url);
        } else {
          this.filesStatus.push(false);
        }
        this.logger.info('### file status', this.filesStatus);
        if (this.filesStatus.length === this.files.length) {
          this.isRegisterValid = this.filesStatus.every(cur => cur);
          this.logger.info('###', this.isRegisterValid);
        }
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
    this.logger.info('files', this.file);
  }

  uploadFiles(e) {
    const files = e.target.files;
    this.logger.info(files, typeof files);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.files.push(new Upload(files[i]));
    }
    this.logger.info('### files', this.files);
  }

  updateFileStatusEmit(status) {
    // this.filesStatus.push(status);

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
    if (this.photoUrls) {
      postDTO.photoURLs = [...this.photoUrls];
    } else {
      postDTO.photoURLs = [this.basePhoto];
    }
    this.postService.addPost(postDTO).subscribe(res => {
      this.logger.info('### successfully posted data ###');
      this.postStateService.postCloseEmit(true);
    });
  }

  close() {
    this.postStateService.postCloseEmit(true);
    this.router.navigate(['home']);
  }
  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}
