import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from './core/services/auth/auth.service';
import { User } from '@models/user';
@Component({
  selector                              : 'app-root',
  templateUrl                           : './app.component.html',
  styleUrls                             : ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title                                 = 'bulletin board';
  signedIn: boolean = false;
  user: User;

  color = 'primary';
  mode = 'Indeterminate';
  value = 50;
  constructor(
    private readonly logger             : LoggerService,
    private http                        : HttpClient
  ) {}

  ngOnInit() {
  }
}
