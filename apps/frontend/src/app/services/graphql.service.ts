import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  constructor(private http: HttpClient) {}

  /**
   * Perform a GraphQL query.
   * @param options the query and the optional variables for it
   * @example this.graphqlService.query({ query: '{Products{description,name,subTitle,price,}}' });
   * @returns the query response
   */
  public query<T>(options: {
    query: string;
    variables?: { [key: string]: any };
  }): Observable<T> {
    return this.http
      .post<{ data: T }>(`${env.apiUrl}/products`, {
        query: options.query,
        variables: options.variables,
      })
      .pipe(map((d) => d.data));
  }

  public mutate<T>(options: {
    mutation: string;
    variables?: { [key: string]: any };
  }): Observable<any> {
    return this.http
      .post<{ data: T }>(`${env.apiUrl}/products`, {
        query: options.mutation,
        variables: options.variables,
      })
      .pipe(map((d) => d.data));
  }
}
