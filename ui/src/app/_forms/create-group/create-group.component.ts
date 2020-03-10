import {Component, EventEmitter, Output} from '@angular/core';
import {ApiService} from '../../_services/api.service';
import {CreatableGroup, Group} from '../../_interfaces/interfaces';

@Component({
  selector: 'skl-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent {

  groupName = '';
  ruleSetId = 1;

  @Output() groupCreated = new EventEmitter<Group>();

  constructor(private apiService: ApiService) {
  }

  createGroup(): void {
    if (!this.groupName || this.groupName.length === 0) {
      alert('Gruppennamen ist nicht valide!');
      return;
    }

    const group: CreatableGroup = {name: this.groupName, ruleSetId: this.ruleSetId};

    this.apiService.createGroup(group)
      .subscribe((result) => {
        if (group) {
          this.groupName = '';
          this.groupCreated.emit(result);
        }
      });
  }

}
