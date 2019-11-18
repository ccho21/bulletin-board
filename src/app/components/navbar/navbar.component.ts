import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Angular fire Auth
import { AngularFireAuth } from '@angular/fire/auth';

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PopupService } from '@app/core/services/popup/popup.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { from } from 'rxjs';
import { User } from '@models/user';

@Component({
  selector                      : 'app-navbar',
  templateUrl                   : './navbar.component.html',
  styleUrls                     : ['./navbar.component.scss'],
  providers                     : [NgbModal]
})
export class NavbarComponent implements OnInit {
  private toggleButton          : any;
  private sidebarVisible        : boolean;
  private colorOnScroll         = 500;
  navBackgroundColor            : boolean;
  @Input() isLoggedIn           : boolean;
  @Input() user                 : User;
  constructor(
    public location             : Location,
    private element             : ElementRef,
    private logger              : LoggerService,
    private popupService        : PopupService,
    private router              : Router,
    private modalService        : NgbModal,
    private authService         : AuthService,
    private afAuth              : AngularFireAuth
  ) {
    this.sidebarVisible         = false;
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    const scrollTop             = event.target.scrollingElement.scrollTop;
    if (scrollTop > this.colorOnScroll) {
      this.navBackgroundColor   = true;
    } else {
      this.navBackgroundColor   = false;
    }
  }

  ngOnInit() {
    this.afAuth.authState.pipe(this.authService.firebaseAuthChangeListener).subscribe((res: any) => {
      this.logger.info(res);
      if(res) {
        const {displayName, uid, photoURL, email, emailVerified} = res;
        this.user = {
          displayName, uid, photoURL, email, emailVerified
        }
        if(this.user) {
          this.isLoggedIn = true;
        }
      }
    });
    const navbar                : HTMLElement = this.element.nativeElement;
    this.toggleButton           = navbar.getElementsByClassName('navbar-toggler')[0];
  }

  // SIGN IN
  signInOpen() {
    this.logger.info('sign in open ');
    const modalRef              = this.modalService.open(SignInComponent).result;
    from(modalRef).subscribe(res => {
      this.logger.info('### modal result ', res);
      this.isLoggedIn           = res;
    });
  }
  signUpOpen() {
    this.logger.info('sign up open ');
    const modalRef              = this.modalService.open(SignUpComponent, { size: 'lg' })
      .result;
    from(modalRef).subscribe(res => {
      this.logger.info('### modal result ', res);
      this.isLoggedIn           = res;
    });
  }
  signOut() {
    from(this.authService.signOut()).subscribe(res => {
      this.isLoggedIn           = false;
    });
  }
  // FUNCTIONS
  sidebarOpen() {
    const toggleButton          = this.toggleButton;
    const html                  = document.getElementsByTagName('html')[0];
    // console.log(html);
    // console.log(toggleButton, 'toggle');

    setTimeout(function() {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible         = true;
  }

  sidebarClose() {
    const html                  = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible         = false;
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
    var titlee                  = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee                    = titlee.slice(1);
    }
    if (titlee === '/home') {
      return true;
    } else {
      return false;
    }
  }

  isDocumentation() {
    var titlee                  = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee                    = titlee.slice(1);
    }
    if (titlee === '/documentation') {
      return true;
    } else {
      return false;
    }
  }
}
