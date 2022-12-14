import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Get the wishlist of the given user.\
   * Creates it if it doesn't already exist.
   * @returns observable of the wishlist object
   */
  getMyWishlist(): Observable<IWishlist[]> {
    return this.http.get<IWishlist[]>(`${env.apiUrl}/wishlist`);
  }

  /**
   * Replaces the current products list with a new one.
   * @param productsList the products list to upload.
   * @returns observable of the updated wishlist
   */
  updateWishlist(productsList: IProduct[]): Observable<IWishlist> {
    return this.http.patch<IWishlist>(`${env.apiUrl}/wishlist`, {
      products: productsList,
    });
  }
}
