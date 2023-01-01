import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'frontend-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements OnInit {
  signupForm!: FormGroup;

  email = '';
  token = '';

  /**
   * Small object used to show simple alerts to the user
   */
  alert?: { message: string; type: 'error' | 'info' };
  /**
   * Is set to true when certain actions like pressing the signup button shouldn't be possible due to data loading / waiting for request result.
   */
  isLoading = false;

  isLoggedIn = false;

  inviteAccepted = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  /**
   * Initialize the signup form
   */
  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.email || !this.token) {
      this.router.navigate(['/']);
    }

    this.signupForm = new FormGroup({
      email: new FormControl({ value: this.email, disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
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
      .acceptInvite({
        email,
        username: email,
        name,
        password,
        inviteToken: this.token,
      })
      .subscribe({
        next: (response) => {
          console.log('Accept Invite request', response);

          this.alert = {
            message: `Accepted invite as ${email}`,
            type: 'info',
          };
          this.isLoading = false;
          this.inviteAccepted = true;

          // TODO - verify that the response is processed as expected
          // this.authService.saveAccessInfo(response);
          // Redirect the user to the characters page
          // this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading = false;
          this.alert = {
            message: 'Failed to accept invite',
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
