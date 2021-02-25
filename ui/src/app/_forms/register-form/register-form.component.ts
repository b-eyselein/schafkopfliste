import {Component, OnInit} from '@angular/core';
import {RegisterGQL, RegisterUserInput} from '../../_services/apollo_services';
import {GraphQLError} from 'graphql';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({templateUrl: './register-form.component.html'})
export class RegisterFormComponent implements OnInit {

  registerForm: FormGroup;

  submitted = false;
  loading = false;

  queryError: GraphQLError;
  registeredUsername: string;

  constructor(private fb: FormBuilder, private registerMutation: RegisterGQL) {
  }

  ngOnInit() {
    // FIXME: validator for password equality!
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    });
  }

  register(): void {
    this.submitted = true;

    const password = this.registerForm.controls.password.value;
    const passwordRepeat = this.registerForm.controls.passwordRepeat.value;

    if (this.registerForm.invalid || password !== passwordRepeat) {
      alert('One of your fields is not valid!');
      return;
    }

    const registerUserInput: RegisterUserInput = {
      username: this.registerForm.controls.username.value,
      password,
      passwordRepeat
    };

    this.loading = true;

    this.registerMutation
      .mutate({registerUserInput})
      .subscribe(
        ({data}) => {
          this.queryError = null;
          this.registeredUsername = data.registerUser;
          this.loading = false;
        },
        (error: GraphQLError) => {
          this.queryError = error;
          this.registeredUsername = null;
          this.loading = false;
        }
      );

  }

}
