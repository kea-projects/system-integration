import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../services/products.service';
import { IWishlist, WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'frontend-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: IWishlist | null = null;
  isLoading = true;

  constructor(private readonly wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.fetchWishlist();
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
}
