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
      abbreviation: ['', Validators.required],
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

  updateAbbreviation(): void {
    const firstValue = this.firstNameValue ? this.firstNameValue.charAt(0).toUpperCase() : '';
    const lastValue = this.lastNameValue ? this.lastNameValue.charAt(0).toUpperCase() : '';

    this.f.abbreviation.setValue(firstValue + '' + lastValue);
  }

  createPlayer(): void {
    if (this.playerForm.invalid) {
      alert('Formulardaten sind nicht valide!');
      return;
    }

    const abbreviation = this.f.abbreviation.value;
    const name = this.firstNameValue + ' ' + this.lastNameValue;

    this.playerCreationGQL
      .mutate({name, abbreviation})
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
