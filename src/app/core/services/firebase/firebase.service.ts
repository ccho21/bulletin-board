import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, from  } from 'rxjs';
import { Timeouts } from 'selenium-webdriver';
import { LoggerService } from '../logger/logger.service';
import { Upload } from '@app/shared/models/upload';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(public db: AngularFirestore,
    private logger: LoggerService
    ) {}

  getProfilePictures() {
    return this.db.collection('profile-pictures').snapshotChanges();
  }

  getProfilePicture(id: string) {
    return this.db.collection('profile-pictures').doc(id).snapshotChanges();
  }

  createProfilePicture(fileDTO) {
    this.logger.info('### value', fileDTO);
    return from(this.db.collection('/profile-pictures').add(fileDTO));
  }

  getUsers() {
    return this.db.collection('users').snapshotChanges();
  }

  getUser(userKey) {
    return this.db
      .collection('users')
      .doc(userKey)
      .snapshotChanges();
  }

  updateUser(userKey, value) {
    value.nameToSearch = value.name.toLowerCase();
    return this.db
      .collection('users')
      .doc(userKey)
      .set(value);
  }

  deleteUser(userKey) {
    return this.db
      .collection('users')
      .doc(userKey)
      .delete();
  }


  searchUsers(searchValue) {
    return this.db
      .collection('users', ref =>
        ref
          .where('nameToSearch', '>=', searchValue)
          .where('nameToSearch', '<=', searchValue + '\uf8ff')
      )
      .snapshotChanges();
  }

  searchUsersByAge(value) {
    return this.db
      .collection('users', ref => ref.orderBy('age').startAt(value))
      .snapshotChanges();
  }

  createUser(value, avatar) {
    return this.db.collection('users').add({
      name: value.name,
      nameToSearch: value.name.toLowerCase(),
      surname: value.surname,
      age: parseInt(value.age),
      avatar: avatar
    });
  }
}
