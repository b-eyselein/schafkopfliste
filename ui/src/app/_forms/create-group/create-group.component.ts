import {Component} from '@angular/core';
import {ApiService} from "../../_services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreatableGroup, Group} from "../../_interfaces/group";

@Component({templateUrl: './create-group.component.html'})
export class CreateGroupComponent {

  groupForm: FormGroup;
  createdGroup: Group | undefined;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  createGroup(): void {
    if (this.groupForm.invalid) {
      alert('Gruppennamen ist nicht valide!');
      return;
    }

    const group: CreatableGroup = {
      name: this.groupForm.controls.name.value
    };

    this.apiService.createGroup(group)
      .subscribe((group) => this.createdGroup = group);
  }

}
