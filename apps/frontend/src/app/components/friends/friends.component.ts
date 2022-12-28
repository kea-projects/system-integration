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
  }[] = [];
  isLoading = true;

  constructor(private readonly friendsService: FriendsService) {}
  ngOnInit(): void {
    this.fetchFriends();
  }

  fetchFriends(): void {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response.friends;
        console.log('response', response);

        this.isLoading = false;
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
        console.log('response', response);
        this.fetchFriends();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
