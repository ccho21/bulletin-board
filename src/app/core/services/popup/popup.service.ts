import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import { SignInComponent } from '@app/components/sign-in/sign-in.component';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private matDialog: MatDialog) {}

  public signinPopup(): Observable<any> {
    let dialogRef: MatDialogRef<SignInComponent>;
    dialogRef = this.matDialog.open(SignInComponent, {
      width: '920px',
      height: '900px',
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
}
