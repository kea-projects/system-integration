import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, IAccessInfo } from './services/auth.service';
import { PicturesService } from './services/pictures.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  accessInfo: IAccessInfo | null = null;
  autoCheckInterval: any;
  loadedProfilePicture = false;
  profilePictureImg: SafeUrl | null = null;

  constructor(
    readonly router: Router,
    private readonly authService: AuthService,
    private readonly picturesService: PicturesService
  ) {}

  ngOnInit(): void {
    // Check the logged in information every second
    this.accessInfo = this.authService.getAccessInfo();
    this.autoCheckInterval = setInterval(() => {
      this.accessInfo = this.authService.getAccessInfo();
    }, 1000);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/login') || event.url.includes('/signup')) {
          this.profilePictureImg = null;
          this.loadedProfilePicture = false;
        } else {
          this.fetchProfilePicture();
        }
      }
    });
  }

  // Remove the interval to prevent memory leaks
  ngOnDestroy(): void {
    clearInterval(this.autoCheckInterval);
  }

  // TODO - implement picture upload
  uploadPicture(): void {
    console.warn(`Called uploadPicture WIP method - NOT IMPLEMENTED!`);
  }

  fetchProfilePicture(): void {
    this.loadedProfilePicture = false;
    this.picturesService.getProfilePicture().subscribe({
      next: (response) => {
        console.log('access info', this.accessInfo);

        this.createImageFromBlob(response);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 404) {
          console.error(err);
        }
        this.loadedProfilePicture = false;
      },
    });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.profilePictureImg = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
      this.loadedProfilePicture = true;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
