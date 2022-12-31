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
   * Get a list of users friends, based on the access token.
   * @returns observable of the users friends list.
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

  /**
   * Check if the user with the given email is already registered.
   * @param email user email.
   * @returns HTTP status 200 if the user does exist, 404 if not.
   */
  checkIfUserExists(email: string) {
    return this.http.get<any>(`${env.apiUrl}/user/user/search`, {
      params: { searchQuery: email },
    });
  }

  /**
   * Trigger sending of the invite email.
   * @param email the email of the user to invite.
   */
  inviteByEmail(email: string) {
    console.log('email', email);
    return this.http.post<any>(`${env.apiUrl}/user/invite/send`, {
      friendEmail: email,
    });
  }

  /**
   * Send a friend request to the already registered user.
   * @param friendId the id of the existing user.
   */
  inviteById(friendId: string) {
    return this.http.post<any>(`${env.apiUrl}/user/relationship`, {
      friendId,
    });
  }

  /**
   * Change the status of an invite with another user.
   * @param friendId the ID of the user.
   * @param status the new status.
   */
  updateInvite(friendId: string, status: 'INVITED' | 'ACCEPTED' | 'REQUESTED') {
    return this.http.put<any>(`${env.apiUrl}/user/relationship`, {
      friendId,
      status,
    });
  }

  /**
   * Delete the given user from the users friend list.
   * @param friendId the user to delete.
   */
  unfriend(friendId: string): Observable<void> {
    return this.http.delete<any>(`${env.apiUrl}/user/relationship`, {
      body: { friendId },
    });
  }
}
