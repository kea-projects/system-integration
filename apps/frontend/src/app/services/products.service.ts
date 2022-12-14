import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './graphql.service';

export interface IProduct {
  category: string;
  description: string;
  id: string;
  name: string;
  subTitle: string;
  subCategory: string;
  price: number;
  link: string;
  overallRank: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private graphqlService: GraphqlService) {}

  /**
   * Get a list of products.
   * @returns an observable on an object with the products list.
   */
  getAll(): Observable<{ Products: IProduct[] }> {
    const query =
      '{Products{category,description,id,name,subTitle,subCategory,price,link,overallRank,}}';
    return this.graphqlService.query({ query });
  }
}
