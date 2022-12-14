import { Component, OnInit } from '@angular/core';
import { IProduct, ProductsService } from '../../services/products.service';

@Component({
  selector: 'frontend-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  isLoading = true;

  constructor(private readonly productsService: ProductsService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productsService.getAll().subscribe({
      next: (response) => {
        console.log(response.Products);
        this.products = response.Products;
        this.isLoading = false;
      },
    });
  }

  // TODO - add wishing functionality
  addToWishlist(product: IProduct) {
    console.warn(`Called addToWishlist WIP method - NOT IMPLEMENTED!`);
    console.log(`Adding ${product.name} to wishlist`);
  }
}
