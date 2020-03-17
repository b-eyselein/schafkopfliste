import {Component, OnInit} from '@angular/core';
import {Group, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

interface BasicGroup {
  id: number;
  name: string;
  playerCount: number;
}

interface QueryResult {
  groups: BasicGroup[];
}

const groupWithPlayerCountQuery = gql`{
  groups {
    id
    name
    playerCount
  }
}`;

@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  currentUser: UserWithToken;
  groups: BasicGroup[];

  constructor(
    private authenticationService: AuthenticationService,
    private apollo: Apollo
  ) {
  }

  ngOnInit() {
    this.apollo
      .query<QueryResult>({query: groupWithPlayerCountQuery})
      .subscribe(({data, loading}) => this.groups = data.groups);

    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);
  }

  onGroupCreated(group: Group) {
    this.groups.push({
      id: group.id,
      name: group.name,
      playerCount: 0
    });
  }
}
