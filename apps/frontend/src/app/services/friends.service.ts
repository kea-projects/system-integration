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
   * Get a list of users friends, based on the acesss token.
   * @returns observable users friends.
   */
  getFriends(): Observable<{
    name: string;
    email: string;
    userId: string;
    friends: {
      friendId: string;
      friendName: string;
      friendEmail: string;
      friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
      requestedBy: string;
    }[];
  }> {
    return this.http.get<any>(`${env.apiUrl}/user/user/w-friends`);
  }

  checkIfUserExists(email: string) {
    return this.http.get<any>(`${env.apiUrl}/user/user/search`, {
      params: { searchQuery: email },
    });
  }

  inviteByEmail(email: string) {
    console.log('email', email);
    return this.http.post<any>(`${env.apiUrl}/user/invite/send`, {
      friendEmail: email,
    });
  }

  inviteById(friendId: string) {
    return this.http.post<any>(`${env.apiUrl}/user/relationship`, {
      friendId,
    });
  }

  /**
   * Delete the given user from the users friend list.
   */
  unfriend(friendId: string): Observable<void> {
    return this.http.delete<any>(`${env.apiUrl}/user/relationship`, {
      body: { friendId },
    });
  }
}
