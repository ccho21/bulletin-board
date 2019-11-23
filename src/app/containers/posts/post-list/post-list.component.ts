import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../post';

@Component({
  selector                  : 'app-post-list',
  templateUrl               : './post-list.component.html',
  styleUrls                 : ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts: Array<Post> = [];
  constructor(
    private logger          : LoggerService,
    private postService    : PostService
  ) { }

  ngOnInit() {
    this.postService.getPosts().subscribe(res => {
      const data = res;
      if(data.length) {
        res.forEach(cur => {
          this.logger.info(cur.payload.doc.data());
          const post: Post = cur.payload.doc.data() as Post;
          this.posts.push(post);
        });
      }
    })
  }

}
