import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from "@app/shared/loader/loader.service";
import { LoggerService } from "../services/logger/logger.service";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    public loaderService: LoaderService,
    private logger: LoggerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.logger.info("###!", req);
    this.loaderService.show();
    return next.handle(req).pipe(
      finalize(() =>
        setTimeout(() => {
            this.logger.info('hide after finalize', req);
          this.loaderService.hide();
        }, 3000)
      )
    );
  }
}
