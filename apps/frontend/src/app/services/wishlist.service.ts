import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { IProduct } from './products.service';

export interface IWishlist {
  _id: string;
  userId: string;
  products: IProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http: HttpClient) {}

  /**
   * Get the wishlist of the given user.
   * Creates it if it doesn't already exist.
   * @returns observable of the wishlist object
   */
  getMyWishlist(): Observable<IWishlist[]> {
    return this.http.get<IWishlist[]>(`${env.apiUrl}/wishlist`);
  }

  /**
   * Get all wishlists.
   * @returns observable of the wishlist objects.
   */
  getAllWishlists(): Observable<IWishlist[]> {
    return this.http.get<IWishlist[]>(`${env.apiUrl}/wishlist/all`);
  }

  /**
   * Replaces the current products list with a new one.
   * @param productsList the products list to upload.
   * @returns observable of the updated wishlist
   */
  updateWishlist(productsList: IProduct[]): Observable<IWishlist> {
    // Create a full product item from the filtered item.
    const products = productsList.map((product) => {
      return {
        ...product,
        overallRank: '0',
        category: 'n/a',
        subCategory: 'n/a',
      };
    });
    return this.http.patch<IWishlist>(`${env.apiUrl}/wishlist`, { products });
  }
}
