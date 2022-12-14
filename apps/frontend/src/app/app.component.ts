import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IAccessInfo } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  accessInfo: IAccessInfo | null = null;
  autoCheckInterval: any;

  constructor(
    readonly router: Router,
    private readonly authService: AuthService
  ) {}
  ngOnInit(): void {
    // Check the logged in information every second
    this.accessInfo = this.authService.getAccessInfo();
    this.autoCheckInterval = setInterval(() => {
      this.accessInfo = this.authService.getAccessInfo();
    }, 1000);
  }

  // Remove the interval to prevent memory leaks
  ngOnDestroy(): void {
    clearInterval(this.autoCheckInterval);
  }

  // TODO - implement picture upload
  uploadPicture(): void {
    console.warn(`Called uploadPicture WIP method - NOT IMPLEMENTED!`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
