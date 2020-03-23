import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from '../../_services/api.service';
import {
  Group,
  GroupCreationGQL,
  GroupCreationMutation,
  RuleSetListGQL,
  RuleSetListQuery
} from '../../_services/apollo_services';

@Component({
  selector: 'skl-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent implements OnInit {

  ruleSetListQuery: RuleSetListQuery;

  groupName = '';
  ruleSetId: number;

  @Output() groupCreated = new EventEmitter<Group>();

  constructor(
    private apiService: ApiService,
    private ruleSetListGQL: RuleSetListGQL,
    private groupCreationGQL: GroupCreationGQL
  ) {
  }

  ngOnInit(): void {
    this.ruleSetListGQL
      .watch()
      .valueChanges
      .subscribe(({data}: { data: RuleSetListQuery }) => this.ruleSetListQuery = data);
  }

  createGroup(): void {
    if (!this.groupName || this.groupName.length === 0 || !this.ruleSetId) {
      alert('Daten sind nicht valide!');
      return;
    }

    console.info(this.groupName);
    console.info(this.ruleSetId);

    this.groupCreationGQL
      .mutate({name: this.groupName, ruleSetId: this.ruleSetId})
      .subscribe(({data}: { data: GroupCreationMutation }) => {
        // tslint:disable-next-line:no-console
        console.info(data);
      });

    /*
    this.apiService.createGroup(group)
      .subscribe((result) => {
        if (group) {
          this.groupName = '';
          this.groupCreated.emit(result);
        }
      });
     */
  }

}
