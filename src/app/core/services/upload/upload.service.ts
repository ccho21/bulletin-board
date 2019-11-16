import { Injectable, ChangeDetectorRef } from '@angular/core';

import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Upload } from '@app/shared/models/upload';

import { LoggerService } from '../logger/logger.service';
``;
import { FirebaseService } from '../firebase/firebase.service';

import { Observable, of } from 'rxjs';
import { finalize, tap, mergeMap } from 'rxjs/operators';

@Injectable()
export class UploadService {
  private basePath: string = '/uploads';
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  task: AngularFireUploadTask;

  constructor(
    private logger: LoggerService,
    private storage: AngularFireStorage,
    private fbService: FirebaseService
  ) {}

  startUpload(upload: Upload) {
    // The storage path
    const path = `${this.basePath}/${Date.now()}_${upload.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, upload.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.logger.info('### path', path);
        this.logger.info('### downloadURL', this.downloadURL);
        const fileDTO = {
          path: path,
          url: this.downloadURL,
          name: upload.file.name,
          createdAt: upload.createdAt.toISOString(),
        };
        return this.fbService.createProfilePicture(fileDTO);
      })
    );

    this.snapshot.subscribe(res => {
      if (res) {
        this.logger.info('### profile picture is successfully created', res);
      }
    });
  }
}
