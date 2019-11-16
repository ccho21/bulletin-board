import {Injectable} from '@angular/core';
import {LogginPopupComponent} from '@app/shared/popup/loggin-popup/loggin-popup.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private matDialog: MatDialog) {}

  public logginPopup(): Observable<any> {
    let dialogRef: MatDialogRef<LogginPopupComponent>;
    dialogRef = this.matDialog.open(LogginPopupComponent, {
      width: '920px',
      height: '900px',
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
}
