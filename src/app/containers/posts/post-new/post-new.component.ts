import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../shared/post.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { Post } from "../../../shared/models/post";
@Component({
  selector: "app-post-new",
  templateUrl: "./post-new.component.html",
  styleUrls: ["./post-new.component.scss"]
})
export class PostNewComponent implements OnInit {
  post: Post;
  postFormGroup: FormGroup;
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.postFormGroup = new FormGroup({
      title: new FormControl(''),
      photoURL: new FormControl(''),
      content: new FormControl('')
    });
    this.logger.info(this.postFormGroup);
  }
  onSubmit() {
    if (!this.postFormGroup.valid) {
      return;
    }
    this.logger.info('### form value', this.postFormGroup.value);
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const author: User = { displayName, uid, photoURL, email, emailVerified };
    const post: Post = { ...this.postFormGroup.value, author, createdAt: new Date().toISOString() };
    this.logger.info('###  post', post);
    this.postService.addPost(post).subscribe(res => {
      this.logger.info('### successfully posted data', res);
    })
  }
}
