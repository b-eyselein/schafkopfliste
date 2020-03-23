import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Player, PlayerCreationGQL, PlayerCreationMutation} from '../../_services/apollo_services';

@Component({
  selector: 'skl-create-player',
  templateUrl: './create-player.component.html',
})
export class CreatePlayerComponent {

  playerForm: FormGroup;

  @Output() playerCreated = new EventEmitter<Player>();

  constructor(private fb: FormBuilder,  private playerCreationGQL: PlayerCreationGQL) {
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
      .subscribe(({data}: { data: PlayerCreationMutation }) => {
        // tslint:disable-next-line:no-console
        console.info(data);
        this.playerCreated.emit(data.createPlayer as Player);
      });
  }

}
