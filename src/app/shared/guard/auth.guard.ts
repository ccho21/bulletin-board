import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ModalService } from '@app/core/services/modal/modal.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('### router', this.router);
    if (this.authService.isLoggedIn !== true) {
      window.alert('You are not allowed to access this URL!');
      this.router.navigate(['/login']);
    }
    return true;
  }

}
