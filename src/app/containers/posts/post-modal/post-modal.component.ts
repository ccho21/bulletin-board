import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { ModalService } from '@app/core/services/modal/modal.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PostNewComponent } from '../post-new/post-new.component';
import { PostStateService } from '../post-state.service';
@Component({
  selector: 'app-post-modal',
  template: ''
})
export class PostModalComponent implements OnDestroy, OnInit {
  destroy = new Subject<any>();
  detailDialogRef: MatDialogRef<PostDetailComponent>;
  createDialogRef: MatDialogRef<PostNewComponent>;
  postIdSubscription: Subscription;
  postCloseSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private matDialog: MatDialog,
    private postStateService: PostStateService,
    private location: Location
  ) {
    this.postIdSubscription = this.postStateService.postIdEmitted().subscribe(res => {
      if (res) {
        this.detailDialogRef.close('detail');
        const postId = res;
        this.logger.info(postId);
        this.goToPost(postId);
      }
    });

    this.postCloseSubscription = this.postStateService.postCloseEmitted().subscribe(res => {
      if (res) {
        this.createDialogRef.close('close');
        this.goToPost();
      }
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.logger.info('### route START');
      // When router navigates on this component is takes the params and opens up the photo detail modal
      const postId = params.id;
      if (postId) {
        this.detailDialogRef = this.matDialog.open(PostDetailComponent, {
          width: '1140px',
        });
        this.detailDialogRef.componentInstance.postId = postId;
        this.detailDialogRef.afterClosed().subscribe(res => {
          if (!res) {
            const base = this.router.routerState.snapshot.url.split('/p/');
            this.router.navigateByUrl(base[0]);
          }
        }, error => {
          alert(error);
        });
      } else {
        this.createDialogRef = this.matDialog.open(PostNewComponent, {
          width: '800px',
        });

        this.createDialogRef.afterClosed().subscribe(res => {
          if (!res) {
            const base = this.router.routerState.snapshot.url.split('/p/');
            this.router.navigateByUrl(base[0]);
          }
        }, error => {
          alert(error);
        });
      }

    });
  }
  goToPost(postId?) {
    this.logger.info('### through hrer');
    if (postId) {
      this.router.navigateByUrl(`p/${postId}`);
    } else {
      const base = this.router.routerState.snapshot.url.split('/p/');
      this.router.navigateByUrl(base[0]);
    }
  }

  ngOnDestroy() {
    this.logger.info('### POST MODAL DESTROYED');
    // this.destroy.next();
    if (this.postIdSubscription) {
      this.postIdSubscription.unsubscribe();
    }
    if (this.postCloseSubscription) {
      this.postCloseSubscription.unsubscribe();
    }
  }
}
