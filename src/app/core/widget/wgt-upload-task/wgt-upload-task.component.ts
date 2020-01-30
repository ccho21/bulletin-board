import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { User } from '@app/shared/models/user';
import { Post } from '@app/shared/models/post';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UploadService } from '@app/core/services/upload/upload.service';
import { Upload } from '@app/shared/models/upload';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wgt-upload-task',
  templateUrl: './wgt-upload-task.component.html',
  styleUrls: ['./wgt-upload-task.component.scss']
})
export class WgtUploadTaskComponent implements OnInit {
  isPostValid: boolean;
  @Input() file: Upload;
  @Output() fileStatusEmit = new EventEmitter<boolean>();
  percent: number;
  constructor(
    private logger: LoggerService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.logger.info('##### FILE ####', this.file);
    this.startUpload(this.file);
  }
  startUpload(file) {
    // if file exists, start upload.
    if (file) {
      this.uploadService.startUpload(file).subscribe(res => {
        this.logger.info('percent? ', res);
        this.percent = res;
        if(res === 100) {
          this.isPostValid = true;
        }
      });
    }
  }
}
