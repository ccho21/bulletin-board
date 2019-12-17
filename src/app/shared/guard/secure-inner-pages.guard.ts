import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoggerService } from '@app/core/services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private logger: LoggerService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn) {
      this.logger.info('secure inner pages');
      window.alert("You are not allowed to access this URL!");
       this.router.navigate(['/'])
    }
    return true;
  }
  
}
