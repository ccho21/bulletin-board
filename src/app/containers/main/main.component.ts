import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@app/core/services/firebase/firebase.service';
import { Router, Params } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '@app/core/services/post/post.service';
import { concatMap, toArray } from 'rxjs/operators';
import { from, Subscription, forkJoin, of, Observable } from 'rxjs';
import { Post } from '@app/shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  items: Array<any>;

  postObservable: Observable<any>;

  articleEnd: boolean;
  showSpinner: boolean;
  postLimit = 12;

  constructor(
    public firebaseService: FirebaseService,
    private logger: LoggerService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.logger.info('### MAIN COMPONENT');
    this.getPosts();
  }

  getPosts() {
    this.postObservable = this.postService.getPosts(this.postLimit);
  }
}
