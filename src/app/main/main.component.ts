import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../core/services/firebase/firebase.service';
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

  ageValue = 0;
  searchValue = '';
  items: Array<any>;
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;

  focus;
  focus1;
  postSubscription: Subscription;
  postObservable;

  numberOfPosts = 6;
  articleEnd: boolean;
  showSpinner: boolean;
  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private logger: LoggerService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.numberOfPosts = 6;
    this.postObservable = this.postService.getPosts(this.numberOfPosts);
  }


  viewDetails(item) {
    this.router.navigate(['/details/' + item.payload.doc.id]);
  }

  capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName() {
    const value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
      .subscribe(result => {
        this.name_filtered_items = result;
        this.items = this.combineLists(result, this.age_filtered_items);
      });
  }

  rangeChange(event) {
    this.firebaseService.searchUsersByAge(event.value)
      .subscribe(result => {
        this.age_filtered_items = result;
        this.items = this.combineLists(result, this.name_filtered_items);
      });
  }

  combineLists(a, b) {
    const result = [];

    a.filter(x => {
      return b.filter(x2 => {
        if (x2.payload.doc.id === x.payload.doc.id) {
          result.push(x2);
        }
      });
    });
    return result;
  }

}
