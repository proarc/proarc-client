import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // this.authService.checkOnStart();
    if (this.authService.user) {
      return true;
    } else {
      console.log(route.queryParams)
      const params: any = Object.assign({}, route.queryParams);
      params.url = state.url.split('?')[0];
      this.router.navigate(['/login'], {queryParams: params});
      return false;
      // return this.router.parseUrl('/login');
    }
    
  }

}
