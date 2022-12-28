import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

export interface IAccessInfo {
  token: string;
  user: { userId: string; email: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Perform a login request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
  login(params: { email: string; password: string }): Observable<IAccessInfo> {
    return this.http.post<IAccessInfo>(`${env.apiUrl}/auth/signin`, params);
  }

  /**
   * Perform a signup/registration request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
  register(params: {
    email: string;
    username: string;
    name: string;
    password: string;
  }): Observable<IAccessInfo> {
    return this.http.post<IAccessInfo>(`${env.apiUrl}/auth/signup`, params);
  }

  /**
   * Perform a accept invite request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
  acceptInvite(params: {
    email: string;
    username: string;
    name: string;
    password: string;
    inviteToken: string;
  }): Observable<IAccessInfo> {
    return this.http.post<IAccessInfo>(`${env.apiUrl}/auth/signup`, params);
  }

  /**
   * Remove the logged in user information from local storage and API
   */
  public logout(): void {
    localStorage.removeItem('accessInfo');
    this.router.navigate(['/login']);
    window.location.reload();
  }

  /**
   * Save access information to local storage
   * @param accessInfo information used for authentication like the access token.
   */
  public saveAccessInfo(accessInfo: IAccessInfo): void {
    localStorage.removeItem('accessInfo');
    localStorage.setItem('accessInfo', JSON.stringify(accessInfo));
  }

  /**
   * Get user information for authentication. The data comes from local storage.
   * @returns user information needed for authentication and authorization. Returns null if no information is found.
   */
  public getAccessInfo(): IAccessInfo | null {
    const accessInfo = localStorage.getItem('accessInfo');
    if (accessInfo) {
      return JSON.parse(accessInfo);
    }
    return null;
  }
}
