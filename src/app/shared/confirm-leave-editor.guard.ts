import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RepositoryComponent } from '../pages/repository/repository.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmLeaveEditorGuard implements CanActivate, CanDeactivate<RepositoryComponent> {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: RepositoryComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (component.hasPendingChanges()) {
        // return component.confirmLeaveDialog().pipe(map(c => c === 'true'));
        // return window.confirm('Do you really want to cancel?');
        return true;
      }
      return true;
  }
  
}
