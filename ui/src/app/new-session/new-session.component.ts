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
              firstPlayerNickname: undefined,
              secondPlayerNickname: undefined,
              thirdPlayerNickname: undefined,
              fourthPlayerNickname: undefined,
            };
          },
          (queryError) => {
            this.queryError = queryError;
          });
    });
  }

  updateDealer(dealerId: string | undefined): void {
    this.creatableSession.firstPlayerNickname = dealerId;

    this.playersForPreHand = this.group.players
      .filter((p) => p.nickname !== this.creatableSession.firstPlayerNickname);
  }

  updatePreHand(preHandId: string | undefined): void {
    this.creatableSession.secondPlayerNickname = preHandId;

    const selectedPlayerIds = [this.creatableSession.firstPlayerNickname, this.creatableSession.secondPlayerNickname];

    this.playersForMiddleHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.nickname));
  }

  updateMiddleHand(middleHandId: string | undefined): void {
    this.creatableSession.thirdPlayerNickname = middleHandId;

    const selectedPlayerIds = [
      this.creatableSession.firstPlayerNickname,
      this.creatableSession.secondPlayerNickname,
      this.creatableSession.thirdPlayerNickname
    ];

    this.playersForRearHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.nickname));
  }

  updateRearHand(rearHandId: string | undefined): void {
    this.creatableSession.fourthPlayerNickname = rearHandId;
  }

  createSession(): void {
    this.submitted = true;

    if (
      !this.creatableSession.firstPlayerNickname ||
      !this.creatableSession.secondPlayerNickname ||
      !this.creatableSession.thirdPlayerNickname ||
      !this.creatableSession.fourthPlayerNickname
    ) {
      alert('You have to select a rule set and a player for every position!');
      return;
    }

    this.newSessionGQL.mutate({groupName: this.groupName, sessionInput: this.creatableSession})
      .subscribe(
        ({data}) => {
          // console.info(data);
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
