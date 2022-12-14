import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './graphql.service';

export interface IProduct {
  description: string;
  id: string;
  name: string;
  subTitle: string;
  price: number;
  link: string;
  overallRank: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private graphqlService: GraphqlService) {}
  // Full product query:
  //    '{Products{category,description,id,name,subTitle,subCategory,price,link,overallRank,}}';

  /**
   * Get a list of products.
   * @returns an observable on an object with the products list.
   */
  getAll(): Observable<{ Products: IProduct[] }> {
    const query =
      '{Products{description,id,name,subTitle,price,link,overallRank,}}';
    return this.graphqlService.query({ query });
  }

  /**
   * Get a list of product names.
   * @returns an observable on an object with the product names list.
   */
  getProductNames(): Observable<{ Products: { name: string }[] }> {
    const query = '{Products{name,orderBy:name}}';
    return this.graphqlService.query({ query });
  }
}
