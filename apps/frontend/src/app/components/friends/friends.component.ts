import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'frontend-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  socket: Socket;

  friends: {
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
    requestedBy: string;
  }[] = [];
  filteredFriends: {
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
    requestedBy: string;
  }[] = [];
  friendStatuses: {
    status: 'on' | 'off';
    userId: String;
    username: string;
  }[] = [];

  userId = '';
  isLoading = true;
  searchQuery = '';

  constructor(
    private readonly friendsService: FriendsService,
    private readonly authService: AuthService
  ) {
    // Initialize the socket connection. Only send the user_connected event once the friends list is loaded so it can be included as data.
    this.socket = io(environment.apiUrl, {
      extraHeaders: {
        Authorization: `Bearer ${this.authService.getAccessInfo()?.token}`,
      },
    });
  }
  ngOnInit(): void {
    this.initWebsocket();
    this.fetchFriends();
  }

  fetchFriends(): void {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response.friends;
        this.userId = response.userId;
        console.log('Fetch friends response', response);
        this.updateSearch({ target: { value: '' } });
        this.emitUserConnectedEvent();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Filters the friends list for only the ones containing the provided string in the friend email.
   * @param event the event with a target object and a value string property
   */
  updateSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.filteredFriends = this.friends.filter((friend) =>
      friend.friendEmail.includes(this.searchQuery)
    );
  }

  inviteFriend(): void {
    // Validate that the invite can be sent
    if (!this.isValidEmail()) {
      console.warn('User tried to invite a friend with an invalid email!');
      return;
    }
    if (this.isOnFriendList(this.searchQuery)) {
      console.warn('User tried to invite an already invited friend!');
      return;
    }

    // Check if the user exists, and if they don't send an email invite. If they do, send a friend request.
    this.friendsService.checkIfUserExists(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Check user exists response', response);
        // Check if the user exists. If the list is empty, no matching user exists.
        if (response.length === 0) {
          console.log(`User doesn't exist, sending an email invite`);
          this.friendsService.inviteByEmail(this.searchQuery).subscribe({
            next: (response) => {
              console.log('Invite by email response', response);
              this.fetchFriends();
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.isLoading = false;
            },
          });
        } else {
          console.log(
            `User exists, creating a relationship with ${response[0].userId}`
          );
          this.friendsService.inviteById(response[0].userId).subscribe({
            next: (response) => {
              console.log('Invite by Id response', response);
              this.fetchFriends();
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.isLoading = false;
            },
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  acceptInvite(friendId: string): void {
    this.isLoading = true;
    this.friendsService.updateInvite(friendId, 'ACCEPTED').subscribe({
      next: (response) => {
        console.log('Accept invite response', response);
        this.fetchFriends();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  unfriend(friendId: string): void {
    this.isLoading = true;
    this.friendsService.unfriend(friendId).subscribe({
      next: (response) => {
        console.log('Unfriend response', response);
        this.fetchFriends();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  isValidEmail(): boolean {
    return this.searchQuery.match(/.+@.+\..+/gm) !== null;
  }

  /** Check if the given email is already present on the friends list */
  isOnFriendList(email: string): boolean {
    return (
      this.friends.filter((friend) => friend.friendEmail.includes(email))
        .length !== 0
    );
  }

  /** Check if the given user is on the list of online users */
  isOnline(friendId: string): boolean {
    let isOnline = false;
    for (const status of this.friendStatuses) {
      if (friendId === status.userId && status.status == 'on') {
        isOnline = true;
      }
    }
    return isOnline;
  }

  /**
   * Check whether the given invite comes from another user and is active.
   * @params friend the friend information.
   * @returns whether the invite is active and of the logged in user
   */
  isOwnInvite(friend: {
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
    requestedBy: string;
  }): boolean {
    if (!friend.requestedBy) {
      return true;
    }
    return friend.requestedBy === this.userId;
  }

  // =======================
  // Socket.io functionality

  initWebsocket() {
    console.log('Initializing Socket.io connection');

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('friends_status', (event) => {
      console.log('friends_status event', event);
      this.friendStatuses = event;
    });

    this.socket.on('update_user_status', (event) => {
      console.log('update_user_status event', event);
    });

    this.socket.on('error', (err) => {
      console.warn('Error on socket.io client', err);
    });
  }

  /** Let the friends know this use ris now online */
  emitUserConnectedEvent() {
    const preparedFriendsList: any[] = [];
    this.friends.forEach((friend) => {
      preparedFriendsList.push({
        username: friend.friendEmail,
        userId: friend.friendId,
        status: friend.friendStatus,
      });
    });
    this.socket.emit(`user_connected`, { friendsList: preparedFriendsList });
  }
}
