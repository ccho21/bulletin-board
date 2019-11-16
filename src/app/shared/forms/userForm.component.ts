import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export class userFormGroup {
    userform =  new FormGroup({
        uid: new FormControl(''),
        email: new FormControl(''),
        displayName: new FormControl(''),
        photoURL: new FormControl(''),
        emailVerified: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl(''),
    })
}