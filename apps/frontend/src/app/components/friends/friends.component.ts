import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'frontend-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
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
  userId = '';
  isLoading = true;
  searchQuery = '';

  constructor(private readonly friendsService: FriendsService) {}
  ngOnInit(): void {
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
    if (!this.isValidEmail()) {
      console.warn('User tried to invite a friend with an invalid email!');
      return;
    }
    if (this.isOnFriendList(this.searchQuery)) {
      console.warn('User tried to invite an already invited friend!');
      return;
    }
    this.friendsService.checkIfUserExists(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Check user exists response', response);
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

  isOnFriendList(email: string): boolean {
    return (
      this.friends.filter((friend) => friend.friendEmail.includes(email))
        .length !== 0
    );
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
}
