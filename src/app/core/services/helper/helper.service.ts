import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, Observable, Observer } from 'rxjs';
import { concatMap, bufferCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
  ) { }


  /**
* Delete all documents in specified collections.
*
* @param {string} collections Collection names
* @return {Promise<number>} Total number of documents deleted (from all collections)
*/
  deleteCollection(collection: AngularFirestoreCollection<any>): Promise<number> {
    this.logger.info('############ delete collection ###########');
    let totalDeleteCount = 0;
    const batchSize = 500;
    return new Promise<number>((resolve, reject) =>
      from(collection.ref.get())
        .pipe(
          concatMap((q) => from(q.docs)),
          bufferCount(batchSize),
          concatMap((docs: Array<QueryDocumentSnapshot<any>>) => new Observable((o: Observer<number>) => {
            const batch = this.db.firestore.batch();
            docs.forEach((doc) => batch.delete(doc.ref));
            batch.commit()
              .then(() => {
                o.next(docs.length);
                o.complete();
              })
              .catch((e) => o.error(e));
          })),
        )
        .subscribe(
          (batchDeleteCount: number) => totalDeleteCount += batchDeleteCount,
          (e) => reject(e),
          () => resolve(totalDeleteCount),
        ),
    );
  }
}
