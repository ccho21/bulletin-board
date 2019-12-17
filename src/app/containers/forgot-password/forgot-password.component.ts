import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/services/auth/auth.service";
import { FormControl } from "@angular/forms";
import { ModalService } from "@app/core/services/modal/modal.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  focus;
  constructor(
    public authService: AuthService,
    private modalService: ModalService,
    private router: Router
  ) {}
  email: FormControl;
  ngOnInit() {
    this.email = new FormControl("");
  }

  goBack() {
    this.modalService.signInOpen();
    this.router.navigateByUrl("/");
  }
}
