import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class PicturesService {
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Get the profile picture image as a blob.
   * @returns observable of the blob object.
   */
  getProfilePicture(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'image/jpeg, image/jpg, image/png',
      }),
      responseType: 'blob' as 'json', // This tells angular to parse it as a blob, default is json
    };
    return this.http.get<Observable<Blob>>(
      `${env.apiUrl}/user/profile-picture/random-username-that-doesnt-matter`,
      httpOptions
    );
  }

  /**
   * Upload a file.
   * @param params the selected file.
   */
  uploadPicture(params: { file: File }): Observable<void> {
    const formData = new FormData();
    formData.append('file', params.file);
    return this.http.post<void>(`${env.apiUrl}/user/profile-picture`, formData);
  }
}
