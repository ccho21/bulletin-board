import { Injectable } from '@angular/core';

export abstract class LoggerService {
  abstract info: any;
  abstract warn: any;
  abstract error: any;
  abstract table: any;
}
