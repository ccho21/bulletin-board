import { Injectable, ChangeDetectorRef } from "@angular/core";

import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";

import { Upload } from "@app/shared/models/upload";

import { LoggerService } from "../logger/logger.service";
``;
import { FirebaseService } from "../firebase/firebase.service";

import { Observable, Subject } from "rxjs";
import {
  finalize,
  tap,
  mergeMap,
  delayWhen,
  takeUntil,
  take
} from "rxjs/operators";

@Injectable()
export class UploadService {
  private basePath: string = "/uploads";
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  angularFireUploadTask: AngularFireUploadTask;

  uploadEmitted$ = new Subject();
  constructor(
    private logger: LoggerService,
    private storage: AngularFireStorage,
    private fbService: FirebaseService
  ) {}

  startUpload(upload: Upload) {
    const { path, ref } = this.getFilePathRef(upload);
    // The main task
    this.angularFireUploadTask = this.storage.upload(path, upload.file);

    // Progress monitoring
    this.percentage = this.angularFireUploadTask.percentageChanges();

    this.snapshot = this.angularFireUploadTask.snapshotChanges()
    return this.snapshot;
  }
  getFilePathRef(upload: Upload) {
    // The storage path
    const path = `${this.basePath}/${Date.now()}_${upload.file.name}`;
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    return { path, ref };
  }
  createProfile(fileDTO) {
    this.fbService.createProfilePicture(fileDTO).subscribe(res => {
      this.logger.info(
        "### the file is uploaded and is going to be posted with",
        res
      );
      this.changeUploadStatus(fileDTO);
    });
  }
  getUploadStatus() {
    return this.uploadEmitted$.asObservable();
  }
  changeUploadStatus(fileDTO) {
    this.uploadEmitted$.next(fileDTO);
  }
}
