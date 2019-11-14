import {Component, OnInit, ElementRef, HostListener, Input} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from '@angular/router';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import {LoggerService} from '@app/services/logger/logger.service';
import {PopupService} from '@app/services/popup/popup.service';

@Component({
  selector   : 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private toggleButton  : any;
  private sidebarVisible: boolean;
  private colorOnScroll = 500;
  navBackgroundColor: boolean;
  constructor(
    public  location    : Location,
    private element     : ElementRef,
    private logger      : LoggerService,
    private popupService: PopupService,
    private router      : Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
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
    const navbar: HTMLElement = this.element.nativeElement;
          this.toggleButton   = navbar.getElementsByClassName('navbar-toggler')[0];
  }
  // SIGN IN
  signInOpen() {
    this.logger.info('sign in open ');
    /* Open Popup */
   /*  this.popupService
      .logginPopup()
      .subscribe((_) => {
        this.logger.info(_);
      }); */
      const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'World';
  }

  // FUNCTIONS
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html         = document.getElementsByTagName('html')[0];
    // console.log(html);
    // console.log(toggleButton, 'toggle');

    setTimeout(function() {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
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
    var titlee = this.location.prepareExternalUrl(this.location.path());
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
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee === '/documentation') {
      return true;
    } else {
      return false;
    }
  }
}
export class NgbdModalContent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
}