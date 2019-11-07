import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@app/services/logger/logger.service';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bulletin board';

  constructor(
    private readonly logger: LoggerService,
    private readonly angularFireAuth: AngularFireAuth
    ) {}

  ngOnInit() {
    this.angularFireAuth.authState.subscribe(this.firebaseAuthChangeListener);
    


  }
  private firebaseAuthChangeListener(response) {
    // if needed, do a redirect in here
    if (response) {
      console.log('Logged in :)');
    } else {
      console.log('Logged out :(');
    }
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.logger.info('sign in success', signInSuccessData);
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    this.logger.info('sign in error', errorData);
  }
}
