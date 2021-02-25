import {Component, OnInit} from '@angular/core';
import {GroupCreationGQL, RuleSetListGQL, RuleSetListQuery} from '../../_services/apollo_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './create-group.component.html'})
export class CreateGroupComponent implements OnInit {

  ruleSetListQuery: RuleSetListQuery;

  groupFormGroup: FormGroup;

  loading = false;

  queryError: GraphQLError;
  createdGroupName: string;

  constructor(private fb: FormBuilder, private ruleSetListGQL: RuleSetListGQL, private groupCreationGQL: GroupCreationGQL) {
  }

  ngOnInit(): void {
    this.ruleSetListGQL
      .watch()
      .valueChanges
      .subscribe(({data}: { data: RuleSetListQuery }) => {
        this.ruleSetListQuery = data;

        this.groupFormGroup = this.fb.group({
          name: ['', Validators.required],
          ruleSetName: ['', Validators.required]
        });
      });
  }

  onSubmit(): void {
    if (this.groupFormGroup.invalid) {
      alert('Daten sind nicht valide!');
      return;
    }

    const name = this.groupFormGroup.controls.name.value;
    const ruleSetName = this.groupFormGroup.controls.ruleSetName.value;


    this.groupCreationGQL
      .mutate({name, ruleSetName})
      .subscribe(
        ({data}) => {
          this.queryError = null;
          this.createdGroupName = data.createGroup.name;
        },
        (error) => {
          this.createdGroupName = null;
          this.queryError = error;
        }
      );
  }

}
