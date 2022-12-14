import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'frontend-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm!: FormGroup;
  /**
   * Small object used to show simple alerts to the user
   */
  alert?: { message: string; type: 'error' | 'info' };
  /**
   * Is set to true when certain actions like pressing the signup button shouldn't be possible due to data loading / waiting for request result.
   */
  isLoading = false;

  isLoggedIn = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  /**
   * Initialize the signup form
   */
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
    });
    this.isLoggedIn = this.authService.getAccessInfo() !== null;
  }

  /**
   *  Sign in the user with the credentials from the form.
   */
  async onSubmit(): Promise<void> {
    if (this.signupEnabled()) {
      console.warn('Tried to submit an invalid/dirty signup form');
      return;
    }
    this.isLoading = true;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const name = this.signupForm.get('name')?.value;
    this.authService
      .register({
        email,
        username: email,
        name,
        password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.alert = {
            message: `Signed up as ${email}:${password}`,
            type: 'info',
          };
          this.authService.saveAccessInfo(response);
          // Redirect the user to the characters page
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading = false;
          this.alert = {
            message: 'Failed to sign up',
            type: 'error',
          };
        },
      });
  }

  /**
   * Check whether the signup forms' state allows logging in.
   * @returns whether it is possible to log in.
   */
  signupEnabled(): boolean {
    return !(
      this.isLoading ||
      (this.signupForm.valid && this.signupForm.dirty)
    );
  }

  /**
   * Allow pressing the log in button by pressing enter while the credentials are valid.
   */
  @HostListener('document:keydown.enter') enterKeyPressed() {
    if (this.signupEnabled()) {
      this.onSubmit();
    }
  }
}
