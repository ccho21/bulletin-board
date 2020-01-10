import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { ModalService } from '@app/core/services/modal/modal.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PostStateService } from '../post-state.service';

@Component({
  selector: 'app-post-modal',
  template: ''
})
export class PostModalComponent implements OnDestroy, OnInit {
  destroy = new Subject<any>();
  dialogRef: MatDialogRef<PostDetailComponent>;
  postIdSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private matDialog: MatDialog,
    private postStateService: PostStateService
  ) {
    this.postIdSubscription = this.postStateService.postIdEmitted().subscribe(res => {
      if (res) {
        this.dialogRef.close('page');
        const postId = res;
        this.logger.info(postId);
        this.goToPost(postId);
      }
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.logger.info('### route START');
      // When router navigates on this component is takes the params and opens up the photo detail modal
      const postId = params.id;

      this.dialogRef = this.matDialog.open(PostDetailComponent, {
        width: '1140px',
        height: '600px',
      });
      this.dialogRef.componentInstance.postId = postId;
      this.dialogRef.afterClosed().subscribe(res => {
        this.logger.info('########## AFTER CLOSED', res);
        if (!res) {
          this.router.navigateByUrl('posts');
        }
      }, error => {
        alert(error);
      });
    });
  }
  goToPost(postId) {
    this.router.navigateByUrl(`posts/${postId}`);
  }

  ngOnDestroy() {
    this.logger.info('### POST MODAL DESTROYED');
    // this.destroy.next();
    if (this.postIdSubscription) {
      this.postIdSubscription.unsubscribe();
    }
  }
}
