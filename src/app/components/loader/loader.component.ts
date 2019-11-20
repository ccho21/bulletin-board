import { Component } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { LoaderService } from "@app/core/services/loader/loader.service";
import { LoggerService } from "@app/core/services/logger/logger.service";
@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent {
  color = "warn";
  mode = "indeterminate";
  value = 50;
  isLoading: boolean;
  loadingSubscription: Subscription;
  constructor(
    private loaderService: LoaderService,
    private logger: LoggerService
  ) {
    this.loadingSubscription = this.loaderService.isLoadingEmitted$.subscribe(
      res => {
        this.logger.info("loading?", res);
        this.isLoading = res;
      }
    );
  }
}
