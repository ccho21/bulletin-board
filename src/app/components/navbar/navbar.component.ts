import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Input,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//Angular fire Auth
import { AngularFireAuth } from '@angular/fire/auth';

import { Location } from '@angular/common';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { from, Subscription } from 'rxjs';
import { User } from '@models/user';
import { ModalService } from '@app/core/services/modal/modal.service';
import { FormControl } from '@angular/forms';
import { PostStateService } from '@app/containers/posts/post-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbModal]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private colorOnScroll = 500;
  navBackgroundColor: boolean;
  isLoggedIn: boolean;
  logginSubsctiption: Subscription;
  user: User;
  keyword: FormControl;
  constructor(
    public location: Location,
    private element: ElementRef,
    private logger: LoggerService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    private postStateService: PostStateService
  ) {
    this.sidebarVisible = false;
  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    const scrollTop = event.target.scrollingElement.scrollTop;
    if (scrollTop > this.colorOnScroll) {
      this.navBackgroundColor = true;
    } else {
      this.navBackgroundColor = false;
    }
  }

  ngOnInit() {
    this.keyword = new FormControl('');
    this.logger.info(this.keyword);
    this.authService.getSignedUser().subscribe((res: any) => {
      if (res) {
        const { displayName, uid, photoURL, email, emailVerified } = res;
        this.user = {
          displayName,
          uid,
          photoURL,
          email,
          emailVerified
        };
        if (this.user) {
          this.logger.info('user successfuly signed in', this.user);
          this.isLoggedIn = true;
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      }
    });

    this.logginSubsctiption = this.authService
      .getSignInSource()
      .subscribe(res => {
        this.logger.info('Signed in? ', res);
        this.isLoggedIn = res;
      });

    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }
  signInOpen() {
    this.router.navigate(['login']);
    // this.logger.info('sign In open?');
    // this.modalService.signInOpen();
  }

  signUpOpen() {
    // this.logger.info('sign up open?');
    // this.modalService.signUpOpen();
    this.router.navigate(['sign-up']);
  }

  signOut() {
    from(this.authService.signOut()).subscribe(res => {
      this.isLoggedIn = false;
    });
  }
  // Sign In

  // FUNCTIONS
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];

    setTimeout(() => {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  isHome() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee === '/home') {
      return true;
    } else {
      return false;
    }
  }

  isDocumentation() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee === '/documentation') {
      return true;
    } else {
      return false;
    }
  }
  search() {
    this.logger.info('### search', this.keyword.value);
    const keyword = this.keyword.value;
    this.postStateService.postSearchEmit(keyword);
  }
  cancel(e) {
    this.logger.info(e);
    /* const outsideClicked = !e;
    if (this.sidebarVisible) {
      if (outsideClicked) {
        this.sidebarToggle();
      }
    } */

  }
  ngOnDestroy() {
    this.logginSubsctiption.unsubscribe();
  }
}
