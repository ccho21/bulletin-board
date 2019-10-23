import { Injectable }    from '@angular/core';
import { LoggerService } from './logger.service';
const noop = (): any => undefined;

@Injectable()
export class ConsoleLoggerService extends LoggerService {

  get info() {
    return console.info.bind(console);
  }

  get warn() {
    return console.warn.bind(console);
  }

  get error() {
    return console.error.bind(console);
  }

  get table() {
    return console.table ? console.table.bind(console) : console.info.bind(console);
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFunction: Function = (console)[type] || console.log || noop;
    logFunction.apply(console, [args]);
  }
}
