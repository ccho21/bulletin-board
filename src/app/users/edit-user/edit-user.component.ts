import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router } from '@angular/router';
import { LoggerService } from '@app/services/logger/logger.service';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  exampleForm: FormGroup;
  item: any;

  validation_messages = {
    name: [{ type: 'required', message: 'Name is required.' }],
    surname: [{ type: 'required', message: 'Surname is required.' }],
    age: [{ type: 'required', message: 'Age is required.' }]
  };

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.logger.info('### edit user component starts');
    this.route.data.subscribe(routeData => {
      this.logger.info('### route data', routeData);
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.logger.info('### detail item', this.item);
        this.createForm();
      }
    });
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required],
      surname: [this.item.surname, Validators.required],
      age: [this.item.age, Validators.required]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.item.avatar = result.url;
      }
    });
  }

  onSubmit(value) {
    this.logger.info('### submit value', value);
    value.avatar = this.item.avatar;
    value.age = Number(value.age);
    this.firebaseService.updateUser(this.item.id, value).then(res => {
      this.router.navigate(['/home']);
    });
  }

  delete() {
    this.firebaseService.deleteUser(this.item.id).then(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    );
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}