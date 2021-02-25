import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import {first} from 'rxjs/operators';
import {Credentials} from '../../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './login-form.component.html'})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  submitted = false;
  loading = false;

  returnUrl: string;

  queryError: GraphQLError;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {

    if (this.authenticationService.currentUserValue) {
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      alert('Daten sind nicht valide!');
      return;
    }

    const credentials: Credentials = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };

    this.loading = true;

    this.authenticationService.login(credentials)
      .pipe(first())
      .subscribe(
        ({data}) => {
          this.loading = false;

          if (data.login) {
            this.router.navigate([this.returnUrl]);
          }
        },
        (queryError: GraphQLError) => {
          this.queryError = queryError;
          this.loading = false;
        }
      );
  }
}
