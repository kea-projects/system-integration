import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { IProduct } from '../../services/products.service';
import { IWishlist, WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'frontend-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: IWishlist | null = null;
  friendsWishlist: IWishlist[] = [];
  isLoading = true;

  friends: {
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendStatus: 'INVITED' | 'REQUESTED' | 'ACCEPTED';
    requestedBy: string;
  }[] = [];

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly friendsService: FriendsService
  ) {}

  ngOnInit(): void {
    this.fetchWishlist();
    this.fetchFriends();
  }

  fetchWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getMyWishlist().subscribe({
      next: (response) => {
        console.log('Wishlist of current user', response);
        this.wishlist = response[0];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  fetchFriends(): void {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response.friends;
        console.log('Fetch friends response', response);
        this.fetchFriendsWishlists();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  fetchFriendsWishlists(): void {
    this.isLoading = true;
    this.wishlistService.getAllWishlists().subscribe({
      next: (response) => {
        const friendIds = this.friends.map((friend) => friend.friendId);
        for (const wishlist of response) {
          if (friendIds.includes(wishlist.userId))
            this.friendsWishlist.push(wishlist);
        }
        console.log(`Wishlist of user's friends`, this.friendsWishlist);

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  removeFromWishlist(product: IProduct) {
    console.log(`Removing ${product.name} to wishlist`);
    this.isLoading = true;
    const products = this.wishlist!.products?.filter(
      (item) => item.name !== product.name
    );
    this.wishlistService.updateWishlist(products).subscribe({
      next: (response) => {
        this.wishlist = response;
        this.isLoading = false;
        this.fetchWishlist();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  getFriendName(userId: string): string {
    for (const friend of this.friends) {
      if (friend.friendId === userId) {
        return friend.friendName;
      }
    }
    return 'Anonymous';
  }
}
