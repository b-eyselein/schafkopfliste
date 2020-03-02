import {Component, OnInit} from '@angular/core';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {Player, RuleSet} from '../_interfaces/interfaces';
import {CreatableSession, Session} from '../_interfaces/model';

function stringifyDate(date: Date): string {

  const oneBasedMonth = date.getMonth() + 1;
  const month = oneBasedMonth < 10 ? ('0' + oneBasedMonth) : oneBasedMonth.toString();
  const day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate().toString();

  return `${date.getFullYear()}-${month}-${day}`;
}

function stringifyTime(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}:00`;
}

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;

  submitted = false;

  ruleSets: RuleSet[];

  playersForPreHand: Player[] = [];
  playersForMiddleHand: Player[] = [];
  playersForRearHand: Player[] = [];

  creatableSession: CreatableSession;

  createdSession: Session | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getRuleSets()
      .subscribe((rss) => this.ruleSets = rss);

    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((g) => {
          this.group = g;

          const today = new Date();

          this.creatableSession = {
            date: stringifyDate(today),
            time: stringifyTime(today),
            ruleSetId: this.group.defaultRuleSet?.id,
            firstPlayerId: undefined,
            secondPlayerId: undefined,
            thirdPlayerId: undefined,
            fourthPlayerId: undefined,
          };

          console.info(JSON.stringify(this.creatableSession, null, 2));
        });

    });
  }

  updateDate(value: string): void {
    this.creatableSession.date = stringifyDate(new Date(value));
  }

  updateTime(value: string): void {
    console.info(value);
    this.creatableSession.time = value;
  }

  updateDealer(dealerId: number | undefined): void {
    this.creatableSession.firstPlayerId = dealerId;

    this.playersForPreHand = this.group.players
      .filter((p) => p.id !== this.creatableSession.firstPlayerId);
  }

  updatePreHand(preHandId: number): void {
    this.creatableSession.secondPlayerId = preHandId;

    const selectedPlayerIds = [this.creatableSession.firstPlayerId, this.creatableSession.secondPlayerId];

    this.playersForMiddleHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.id));
  }


  updateMiddleHand(middleHandId: number): void {
    this.creatableSession.thirdPlayerId = middleHandId;

    const selectedPlayerIds = [this.creatableSession.firstPlayerId, this.creatableSession.secondPlayerId, this.creatableSession.thirdPlayerId];

    this.playersForRearHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.id));
  }

  updateRearHand(rearHandId: number): void {
    this.creatableSession.fourthPlayerId = rearHandId;
  }

  createSession(): void {
    this.submitted = true;

    if (!this.creatableSession.ruleSetId ||
      !this.creatableSession.firstPlayerId ||
      !this.creatableSession.secondPlayerId ||
      !this.creatableSession.thirdPlayerId ||
      !this.creatableSession.fourthPlayerId
    ) {
      alert('You have to select a rule set and a player for every position!');
      return;
    }

    this.apiService.createSession(this.group.id, this.creatableSession)
      .subscribe((session) => this.createdSession = session);
  }

}
