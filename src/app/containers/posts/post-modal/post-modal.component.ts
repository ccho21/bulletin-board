import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { ModalService } from '@app/core/services/modal/modal.service';

@Component({
  selector: 'app-post-modal',
  template: ''
})
export class PostModalComponent implements OnDestroy, OnInit {
  destroy = new Subject<any>();
  currentDialog = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private modalService: ModalService
  ) {
  }
  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      // When router navigates on this component is takes the params and opens up the photo detail modal
      this.modalService.postDetailPopup(params.id).subscribe(res => {
        this.logger.info('###', res);
        this.router.navigateByUrl('/posts');
      }, error => {
        alert(error);
        this.router.navigateByUrl('/posts');
      });
    });
  }
  ngOnDestroy() {
    this.destroy.next();
  }
}
