import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // check if the user is authenticated to view the given page
    // if no authentication and trying to access a protected page - redirect to login
    const accessInfo = this.authService.getAccessInfo();
    if (accessInfo === null) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
