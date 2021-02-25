import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AddPlayerToGroupGQL, PlayersInGroupGQL, PlayersInGroupQuery} from '../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './players-in-group.component.html'})
export class PlayersInGroupComponent implements OnInit {

  groupName: string;

  playersInGroupQuery: PlayersInGroupQuery;
  queryError: GraphQLError;

  constructor(
    private route: ActivatedRoute,
    private playersInGroupGQL: PlayersInGroupGQL,
    private addPlayerToGroupGQL: AddPlayerToGroupGQL
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.groupName = paramMap.get('groupName');

      this.playersInGroupGQL
        .watch({groupName: this.groupName})
        .valueChanges
        .subscribe(
          ({data}) => this.playersInGroupQuery = data,
          (error) => this.queryError = error
        );
    });
  }

  toggleGroupMembership(playerName: string, newState: boolean): void {
    // TODO: implement!
    console.info(`TODO: add ${playerName} to group ${this.groupName} with state ${newState}!`);

    this.addPlayerToGroupGQL
      .mutate({playerName, groupName: this.groupName, newState})
      .subscribe(
        ({data}) => console.info(data),
        (error) => console.error(error)
      );

    /*
    this.apiService.toggleGroupMembershipForPlayer(this.groupWithPlayerMembership.group.id, playerName, !p.isMember)
      .subscribe((isMember) => p.isMember = isMember);
     */
  }

}
