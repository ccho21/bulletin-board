import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { LoggerService } from "../logger/logger.service";
@Injectable({
  providedIn: "root"
})
export class LoaderService {
  constructor(private logger: LoggerService) {}
  isLoading = new Subject<boolean>();
  isLoadingEmitted$ = this.isLoading.asObservable();
  show() {
    this.logger.info('function show is called');
    this.isLoading.next(true);
  }
  hide() {
    setTimeout(() => {
      this.isLoading.next(false);
    }, 0);
  }
}
