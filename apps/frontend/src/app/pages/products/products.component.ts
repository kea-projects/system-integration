import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct, ProductsService } from '../../services/products.service';
import { IWishlist, WishlistService } from '../../services/wishlist.service';

interface IExpandedProduct extends IProduct {
  isWishlisted?: boolean;
}

@Component({
  selector: 'frontend-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: IExpandedProduct[] = [];
  filteredProducts: IExpandedProduct[] = [];
  wishlist: IWishlist | null = null;
  isLoading = true;
  searchQuery = '';

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
        console.log('Products', response.Products);
        this.products = response.Products;
        if (this.wishlist && this.wishlist?.products.length != 0) {
          this.markWishlistedItems();
        }
        this.updateSearch({ target: { value: '' } });
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
        if (this.products.length != 0) {
          this.markWishlistedItems();
        }
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
        this.fetchProducts();
        this.fetchWishlist();
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
        this.fetchProducts();
        this.fetchWishlist();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Set the optional isWhitelisted property on the products to indicate if it is on the wishlist
   */
  markWishlistedItems(): void {
    this.products.forEach((product) => {
      product.isWishlisted = this.wishlist!.products.some(
        (wishItem) => product.name === wishItem.name
      );
    });
  }

  // ===============
  // Products search

  /**
   * Filters the products list for only the ones containing the provided string in the product name.
   * @param event the event with a target object and a value string property
   */
  updateSearch(event: any) {
    this.searchQuery = event.target.value;
    console.log('Search query', this.searchQuery);

    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
