import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { User } from '@app/shared/models/user';
import { Post } from '@app/shared/models/post';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UploadService } from '@app/core/services/upload/upload.service';
import { Upload } from '@app/shared/models/upload';

@Component({
  selector: 'app-fln-upload-task',
  templateUrl: './fln-upload-task.component.html',
  styleUrls: ['./fln-upload-task.component.scss']
})
export class FlnUploadTaskComponent implements OnInit {
  isRegisterValid: boolean;
  @Input() file: Upload;
  constructor(
    private logger: LoggerService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.logger.info('##### FILE ####', this.file);
  }
  startUpload() {
    // if file exists, start upload.
    if (this.file) {
      this.uploadService.startUpload(this.file).subscribe(res => {
        this.isRegisterValid = false;
      });
    }
  }

}
