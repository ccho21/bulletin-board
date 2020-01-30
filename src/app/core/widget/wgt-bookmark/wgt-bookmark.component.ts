import { Component, OnInit, Input } from '@angular/core';
import { BookmarkService } from '@app/core/services/bookmark/bookmark.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Post } from '@app/shared/models/post';
import { Bookmark } from '@app/shared/models/bookmark';

@Component({
  selector: 'app-wgt-bookmark',
  templateUrl: './wgt-bookmark.component.html',
  styleUrls: ['./wgt-bookmark.component.scss']
})
export class WgtBookmarkComponent implements OnInit {
  isBookmarked: Bookmark;
  data;
  @Input() post: Post;
  constructor(
    private bookmarkService: BookmarkService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.initData();
    this.checkBookmarked();
  }

  initData() {
    this.data = this.post;
    this.logger.info('####  BOOKMARK #####', this.data);

  }
  checkBookmarked() {
    this.isBookmarked = this.data.isBookmarked ? this.data.isBookmarked : null;
  }

  clickBookmark() {
    this.logger.info('### BOOKMARK IS CLICKED ###');
    this.isBookmarked = this.data.isBookmarked ? this.data.isBookmarked : null;
    const postId = this.post.postId;
    if (!this.isBookmarked) {
      this.addBookmark(postId);
    } else {
      this.removeBookmark(this.isBookmarked);
    }
  }

  addBookmark(postId) {
    this.bookmarkService.addBookmark(postId).subscribe(res => {
      this.logger.info('### like successfully added', res);
      this.isBookmarked = res;
    });
  }

  removeBookmark(isBookmarked) {
    const bookmark = { ...isBookmarked };
    this.bookmarkService.removeBookmark(bookmark).subscribe(res => {
      this.logger.info('### like successfully Deleted', res);
      this.isBookmarked = null;
      this.data.isBookmarked = null;
    });
  }
}
