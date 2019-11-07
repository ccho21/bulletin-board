import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MatDialogRef } from '@angular/material';
import { LoggerService } from '@app/services/logger/logger.service';

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent implements OnInit {

  avatars: Array<any> = new Array<any>();

  constructor(
    private dialogRef: MatDialogRef<AvatarDialogComponent>,
    private firebaseService: FirebaseService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.firebaseService.getAvatars()
    .subscribe(data => this.avatars = data);
  }

  close(avatar){
    this.dialogRef.close(avatar)
  }
  onSubmit() {
    this.logger.info('### onSubmit function');
    this.dialogRef.close();
  }
}
