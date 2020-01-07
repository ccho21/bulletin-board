import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { LoggerService } from '@app/core/services/logger/logger.service';

@Component({
  selector: "app-post-modal",
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [``]
})
export class PostModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    private router: Router,
    private logger : LoggerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.logger.info('### post modal Id', this.data.id);
    this.router.navigate(["/posts/" + this.data.id]);
  }
}
