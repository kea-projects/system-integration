import { Component } from '@angular/core';

@Component({
  selector: 'frontend-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  friends = [
    { username: 'User Uno', email: 'user@example.com', status: 'Online' },
    { username: 'User Duo', email: 'user2@example.com', status: 'Online' },
    { username: 'User Trio', email: 'user3@example.com', status: 'Offline' },
    { username: 'User Quadro', email: 'user4@example.com', status: 'Invited' },
  ];
}
