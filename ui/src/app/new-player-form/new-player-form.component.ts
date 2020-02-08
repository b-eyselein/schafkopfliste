import {Component} from '@angular/core';
import {Player, PlayerToCreate} from '../_interfaces/player';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../_services/api.service";

@Component({templateUrl: './new-player-form.component.html'})
export class NewPlayerFormComponent {

  playerForm: FormGroup;
  createdPlayer: Player | undefined;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
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

    const player: PlayerToCreate = {
      abbreviation: this.f.abbreviation.value,
      name: this.firstNameValue + ' ' + this.lastNameValue
    };

    this.apiService.createPlayer(player)
      .subscribe((result) => this.createdPlayer = result);
  }

}
