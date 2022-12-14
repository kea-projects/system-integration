import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

const TOKEN_HEADER_KEY = 'Authorization'; // for normal back-end
// const TOKEN_HEADER_KEY = 'x-access-token'; // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Add the bearer token to the api request if the user is authenticated.
   * If the accessToken is expired, it will try to refresh it using the refreshToken.
   * @param req the request
   * @param next
   * @returns the original request with the authentication token
   */
  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    let authReq = req;

    // check if the user is authenticated
    const accessInfo = this.authService.getAccessInfo();
    if (accessInfo != null) {
      // add the access token as the bearer token for authentication
      authReq = req.clone({
        headers: req.headers.set(
          TOKEN_HEADER_KEY,
          'Bearer ' + accessInfo.token
        ),
      });
      return next.handle(authReq);
    } else {
      // basically, do nothing since the request doesn't need to be authenticated
      return next.handle(authReq);
    }
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
