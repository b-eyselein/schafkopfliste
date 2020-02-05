import {Component, OnInit} from '@angular/core';
import {Player} from '../_interfaces/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../_services/api.service";

@Component({templateUrl: './new-player-form.component.html'})
export class NewPlayerFormComponent implements OnInit {

  playerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.playerForm = this.fb.group({
      abbreviation: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  get firstNameValue(): string | undefined {
    return this.playerForm.controls.firstName.value;
  }

  get lastNameValue(): string | undefined {
    return this.playerForm.controls.lastName.value;
  }

  updateAbbreviation(): void {
    const firstValue = this.firstNameValue ? this.firstNameValue.charAt(0).toUpperCase() : '';
    const lastValue = this.lastNameValue ? this.lastNameValue.charAt(0).toUpperCase() : '';
    this.playerForm.controls.abbreviation.setValue(firstValue + '' + lastValue);
  }

  createPlayer(): void {
    if (this.playerForm.invalid) {
      alert('Formulardaten sind nicht valide!');
      return;
    }

    const player: Player = {
      abbreviation: this.playerForm.controls.abbreviation.value,
      name: this.playerForm.controls.firstName.value + ' ' + this.playerForm.controls.lastName.value
    };

    this.apiService.createPlayer(player)
      .subscribe((result) => console.info(result));
  }

}
