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
  closeSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private matDialog: MatDialog,
    private postStateService: PostStateService
  ) {

  }
  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.logger.info('### route START');
      // When router navigates on this component is takes the params and opens up the photo detail modal
      const postId = params.id;
      this.logger.info('##### postId', postId);
      this.dialogRef = this.matDialog.open(PostDetailComponent, {
        width: '1140px',
        height: '600px',
      });
      this.dialogRef.componentInstance.postId = postId;
      this.logger.info('### DIALOGREF #########', this.dialogRef);
      this.dialogRef.afterClosed().subscribe(res => {
        this.router.navigateByUrl('/posts');
      }, error => {
        alert(error);
        this.router.navigateByUrl('/posts');
      });
    });

    this.postStateService.getCloseEmitted().subscribe(res => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.logger.info('### POST MODAL DESTROYED');
    this.destroy.next();
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
