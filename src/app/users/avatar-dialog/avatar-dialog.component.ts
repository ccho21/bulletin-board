import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase/firebase.service';
import { MatDialogRef } from '@angular/material';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Upload } from '@app/shared/models/upload';
import { UploadService } from '@app/core/services/upload/upload.service';
@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent implements OnInit, OnDestroy {
  profilePictures: Array<any> = new Array<any>();
  selectedFiles: FileList;
  currentUpload: Upload;
  constructor(
    private dialogRef: MatDialogRef<AvatarDialogComponent>,
    private firebaseService: FirebaseService,
    private logger: LoggerService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.logger.info('### AvatarDialogComponent start');
    this.getData();
  }

  getData() {
    this.firebaseService.getProfilePictures().subscribe(data => {
      if (data) {
        this.profilePictures = data.map((cur: any) => {
          const data = cur.payload.doc.data();
          const id = cur.payload.doc.id;
          return {
            ...data,
            id
          };
        });
        this.logger.info('### get all data ', this.profilePictures);
      }
    });
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }
  uploadFile() {
    let file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    // created at, file, path
    this.logger.info('### current upload', this.currentUpload);
    this.uploadService.startUpload(this.currentUpload);
  }
  updatePicture(picture) {
    this.firebaseService.getProfilePicture(picture.id).subscribe(res =>{
      const data = {...res.payload.data()};
      this.logger.info('### selected picture is', data);
      if(data) {
        this.dialogRef.close(data);
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.logger.info('### onSubmit function');
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.logger.info('### AvatarDialogComponent destroyed');
  }
}
