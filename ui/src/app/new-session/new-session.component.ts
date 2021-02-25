import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  NewSessionGQL,
  NewSessionPlayerValuesFragment,
  NewSessionValuesGQL,
  NewSessionValuesGroupFragment,
  SessionInput
} from '../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  groupName: string;

  group: NewSessionValuesGroupFragment;
  queryError: GraphQLError;

  submitted = false;

  playersForPreHand: NewSessionPlayerValuesFragment[] = [];
  playersForMiddleHand: NewSessionPlayerValuesFragment[] = [];
  playersForRearHand: NewSessionPlayerValuesFragment[] = [];

  creatableSession: SessionInput;

  createdSession: number | undefined;
  mutationQueryError: GraphQLError;

  constructor(
    private route: ActivatedRoute,
    private newSessionValuesGQL: NewSessionValuesGQL,
    private newSessionGQL: NewSessionGQL
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.groupName = paramMap.get('groupName');

      this.newSessionValuesGQL.watch({groupName: this.groupName})
        .valueChanges
        .subscribe(
          ({data}) => {
            this.group = data.group;

            const today = new Date();

            this.creatableSession = {
              dateYear: today.getFullYear(),
              dateMonth: today.getMonth() + 1,
              dateDayOfMonth: today.getDate(),
              timeHours: today.getHours(),
              timeMinutes: today.getMinutes(),
              firstPlayerAbbreviation: undefined,
              secondPlayerAbbreviation: undefined,
              thirdPlayerAbbreviation: undefined,
              fourthPlayerAbbreviation: undefined,
            };
          },
          (queryError) => {
            this.queryError = queryError;
          });
    });
  }

  updateDealer(dealerId: string | undefined): void {
    this.creatableSession.firstPlayerAbbreviation = dealerId;

    this.playersForPreHand = this.group.players
      .filter((p) => p.abbreviation !== this.creatableSession.firstPlayerAbbreviation);
  }

  updatePreHand(preHandId: string | undefined): void {
    this.creatableSession.secondPlayerAbbreviation = preHandId;

    const selectedPlayerIds = [this.creatableSession.firstPlayerAbbreviation, this.creatableSession.secondPlayerAbbreviation];

    this.playersForMiddleHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.abbreviation));
  }

  updateMiddleHand(middleHandId: string | undefined): void {
    this.creatableSession.thirdPlayerAbbreviation = middleHandId;

    const selectedPlayerIds = [
      this.creatableSession.firstPlayerAbbreviation,
      this.creatableSession.secondPlayerAbbreviation,
      this.creatableSession.thirdPlayerAbbreviation
    ];

    this.playersForRearHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.abbreviation));
  }

  updateRearHand(rearHandId: string | undefined): void {
    this.creatableSession.fourthPlayerAbbreviation = rearHandId;
  }

  createSession(): void {
    this.submitted = true;

    if (
      !this.creatableSession.firstPlayerAbbreviation ||
      !this.creatableSession.secondPlayerAbbreviation ||
      !this.creatableSession.thirdPlayerAbbreviation ||
      !this.creatableSession.fourthPlayerAbbreviation
    ) {
      alert('You have to select a rule set and a player for every position!');
      return;
    }

    this.newSessionGQL.mutate({groupName: this.groupName, sessionInput: this.creatableSession})
      .subscribe(
        ({data}) => {
          console.info(data);
          this.createdSession = data.newSession;
          this.mutationQueryError = null;
        },
        (queryError) => {
          this.createdSession = null;
          this.mutationQueryError = queryError;
        }
      );
  }

}
