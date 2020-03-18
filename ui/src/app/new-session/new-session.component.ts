import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {CreatableSession, GroupWithPlayersAndRuleSet, Player, Session} from '../_interfaces/interfaces';

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;

  players: Player[];

  submitted = false;


  playersForPreHand: Player[] = [];
  playersForMiddleHand: Player[] = [];
  playersForRearHand: Player[] = [];

  creatableSession: CreatableSession;

  createdSession: Session | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((g) => {
          this.group = g;

          this.players = this.group.players.map((p) => p.player);

          const today = new Date();

          this.creatableSession = {
            dateYear: today.getFullYear(),
            dateMonth: today.getMonth() + 1,
            dateDayOfMonth: today.getDate(),
            timeHours: today.getHours(),
            timeMinutes: today.getMinutes(),
            firstPlayerId: undefined,
            secondPlayerId: undefined,
            thirdPlayerId: undefined,
            fourthPlayerId: undefined,
          };
        });
    });
  }

  updateDealer(dealerId: number | undefined): void {
    this.creatableSession.firstPlayerId = dealerId;

    this.playersForPreHand = this.players
      .filter((p) => p.id !== this.creatableSession.firstPlayerId);
  }

  updatePreHand(preHandId: number): void {
    this.creatableSession.secondPlayerId = preHandId;

    const selectedPlayerIds = [this.creatableSession.firstPlayerId, this.creatableSession.secondPlayerId];

    this.playersForMiddleHand = this.players
      .filter((p) => !selectedPlayerIds.includes(p.id));
  }

  updateMiddleHand(middleHandId: number): void {
    this.creatableSession.thirdPlayerId = middleHandId;

    const selectedPlayerIds = [
      this.creatableSession.firstPlayerId,
      this.creatableSession.secondPlayerId,
      this.creatableSession.thirdPlayerId
    ];

    this.playersForRearHand = this.players
      .filter((p) => !selectedPlayerIds.includes(p.id));
  }

  updateRearHand(rearHandId: number): void {
    this.creatableSession.fourthPlayerId = rearHandId;
  }

  createSession(): void {
    this.submitted = true;

    if (
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
