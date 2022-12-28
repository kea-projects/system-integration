import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient) {}

  /**
   * Get the profile picture image as a blob.
   * @returns observable of the blob object
   */
  getFriends(): Observable<{
    name: string;
    email: string;
    friends: {
      friendId: string;
      friendName: string;
      friendEmail: string;
      friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
    }[];
  }> {
    return this.http.get<any>(`${env.apiUrl}/user/user/w-friends`);
  }
}
