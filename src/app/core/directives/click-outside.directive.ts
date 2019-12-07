import { Directive, Output, ElementRef, EventEmitter, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[clickoutside]'
})
export class ClickOutsideDirective {

    @Output() clickoutside: EventEmitter<any>;
    constructor(private elementRef: ElementRef) {
        this.clickoutside = new EventEmitter<any>();
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {

        // const isInsideClicked = this.elementRef.nativeElement.contains(targetElement);
        const navbarInsideClicked = targetElement.classList.contains('navbar-nav');
        const togglerClicked = targetElement.closest('.navbar-toggler');
        if (!navbarInsideClicked) {
            if(!togglerClicked) {
                this.clickoutside.emit(navbarInsideClicked);
            }
        }
    }
}