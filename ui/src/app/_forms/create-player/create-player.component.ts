import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlayerCreationGQL} from '../../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './create-player.component.html'})
export class CreatePlayerComponent {

  playerForm: FormGroup;

  loading = false;

  queryError: GraphQLError;
  createdPlayerName: string;

  constructor(private fb: FormBuilder, private playerCreationGQL: PlayerCreationGQL) {
    this.playerForm = this.fb.group({
      nickname: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  private get f() {
    return this.playerForm.controls;
  }

  get firstNameValue(): string | undefined {
    return this.f.firstName.value;
  }

  get lastNameValue(): string | undefined {
    return this.f.lastName.value;
  }

  createPlayer(): void {
    if (this.playerForm.invalid) {
      alert('Formulardaten sind nicht valide!');
      return;
    }

    const nickname = this.f.nickname.value;
    const firstName = this.firstNameValue;
    const lastName = this.lastNameValue;

    this.playerCreationGQL
      .mutate({firstName, lastName, nickname})
      .subscribe(({data}) => {
          this.createdPlayerName = data.createPlayer;
          this.queryError = null;
          this.loading = false;
        },
        (error) => {
          this.createdPlayerName = null;
          this.queryError = error;
          this.loading = false;
        });
  }

}
