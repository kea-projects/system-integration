import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct, ProductsService } from '../../services/products.service';
import { IWishlist, WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'frontend-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  wishlist: IWishlist | null = null;
  isLoading = true;

  constructor(
    private readonly productsService: ProductsService,
    private readonly wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchWishlist();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productsService.getAll().subscribe({
      next: (response) => {
        console.log(response.Products);
        this.products = response.Products;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  fetchWishlist(): void {
    this.wishlistService.getMyWishlist().subscribe({
      next: (response) => {
        console.log('Wishlist of current user', response);
        this.wishlist = response[0];
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  addToWishlist(product: IProduct) {
    console.log(`Adding ${product.name} to wishlist`);
    this.isLoading = true;
    const products = this.wishlist!.products;
    products?.push(product);
    this.wishlistService.updateWishlist(products).subscribe({
      next: (response) => {
        this.wishlist = response;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  isInWishlist(item: IProduct): boolean {
    return this.wishlist!.products.includes(item);
  }
}
