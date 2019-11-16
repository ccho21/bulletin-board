import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { FirebaseService } from '../../core/services/firebase/firebase.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
@Injectable()
export class EditUserResolver implements Resolve<any> {

  constructor(
    public firebaseService: FirebaseService,
    private logger: LoggerService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise((resolve, reject) => {
      this.logger.info('## edit user resolver works');
      let userId = route.paramMap.get('id');
      this.firebaseService.getUser(userId)
      .subscribe(
        data => {
          resolve(data);
        }
      );
    })
  }
}
