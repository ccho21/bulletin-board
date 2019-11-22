import { Component, OnInit } from "@angular/core";
import { Post } from "../post";
import { FormGroup, FormControl } from "@angular/forms";
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostsService } from '../shared/posts.service';
import { AuthService } from '@app/core/services/auth/auth.service';
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
    private postsService: PostsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.postFormGroup = new FormGroup({
      title: new FormControl(''),
      photoURL: new FormControl(''),
      content: new FormControl('')
    });
    this.logger.info(this.postFormGroup);
  }
  onSubmit() {
    if(!this.postFormGroup.valid) {
      return ;
    }
    this.logger.info('### form value', this.postFormGroup.value);
    const post = {...this.postFormGroup.value};
    const user = this.authService.getCurrentUser();
    this.logger.info('### user ',user);
    this.postsService.addPost(post).subscribe(res => {
      this.logger.info('### successfully posted data');
    })
  }
}
