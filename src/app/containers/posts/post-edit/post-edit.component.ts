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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  post: Post;
  postFormGroup: FormGroup;
  file: Upload;
  isSubmitted: boolean;
  uploadSubscription: Subscription;
  isRegisterValid: boolean;
  postDTO: Post;
  postId;
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private authService: AuthService,
    private uploadService: UploadService,
    private route: ActivatedRoute
  ) {
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
      this.postService.updatePost(this.post.postId, this.postDTO).subscribe(res => {
        this.logger.info('### successfully posted data', res);
      })
    });
   }


  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.logger.info(this.postId);

    this.getPost(this.postId);
    this.initForm();


  }
  getPost(postId) {
    this.postService.getPost(postId).subscribe(res => {
      this.logger.info(res);
      this.post = res.payload.data() as Post;

      this.uplaodForm(this.post);
    });
  }
  initForm() {
    this.postFormGroup = new FormGroup({
      title: new FormControl(''),
      photoURL: new FormControl(''),
      content: new FormControl('')
    });
    this.logger.info(this.postFormGroup);
  }
  uplaodForm(post) {
    this.postFormGroup.patchValue({
      title: this.post.title,
      content: this.post.content
    })
  }

  uploadFile(e) {
    this.file = new Upload(e.target.files.item(0));
    this.logger.info("files", this.file);
  }
  updatePost(postId, postDTO) {
    return this.postService.updatePost(postId, postDTO);
  }
  onSubmit() {
    if (!this.postFormGroup.valid) {
      return;
    }
    // check submit valid
    if (this.isSubmitted) {
      return;
    }
    this.logger.info('### form before update', this.postFormGroup);
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const author: User = { displayName, uid, photoURL, email, emailVerified };
    const postDTO: Post = { ...this.postFormGroup.value, author, updatedAt: new Date().toISOString()};
    this.postDTO = postDTO;
    const postId = this.post.postId;

    const postFormGroup = { ...this.postFormGroup.value };
    // if file exists, start upload.
    if (this.file) {
      this.uploadService.startUpload(this.file).subscribe(res => {
        this.isRegisterValid = false;
      });
    } else {
      postFormGroup.photoURL = this.post.photoURL;
      this.updatePost(postId, postDTO).subscribe(res => {
        this.logger.info('### successfully Deleted Post', res);
      })
    }
  }
  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}
