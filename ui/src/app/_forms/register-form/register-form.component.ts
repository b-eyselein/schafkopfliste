import {Component} from '@angular/core';
import {ApiService} from '../../_services/api.service';
import {RegisterValues, SerializableUser} from '../../_interfaces/interfaces';

@Component({templateUrl: './register-form.component.html'})
export class RegisterFormComponent {

  username = '';
  password = '';
  passwordRepeat = '';

  submitted = false;

  registeredUser: SerializableUser;

  constructor(private apiService: ApiService) {
  }

  usernameIsValid(): boolean {
    return this.username && this.username.length > 0;
  }

  passwordIsValid(): boolean {
    return this.password && this.password.length > 0;
  }

  passwordRepeatIsValid(): boolean {
    return this.passwordRepeat && this.passwordRepeat.length > 0 && this.password === this.passwordRepeat;
  }

  register(): void {
    console.warn('TODO: register...');

    if (!this.usernameIsValid() || !this.passwordIsValid() || !this.passwordRepeatIsValid()) {
      alert('One of your fields is not valid!');
      return;
    }

    const registerValues: RegisterValues = {
      username: this.username,
      password: this.password,
      passwordRepeat: this.passwordRepeat
    };

    this.submitted = true;

    this.apiService.putRegistration(registerValues)
      .subscribe((registeredUser) => {
        this.registeredUser = registeredUser;
        this.submitted = false;
      });
  }

}
