import {Component, OnInit} from '@angular/core';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {RuleSet} from '../_interfaces/ruleset';
import {Player} from '../_interfaces/player';
import {SelectableValue, toSelectableValue} from '../_interfaces/selectable-value';
import {CreatableSession, Session} from '../_interfaces/model';

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;

  submitted = false;

  ruleSets: SelectableValue<RuleSet>[];
  ruleSetId: number | undefined;

  playersForDealer: SelectableValue<Player>[];
  firstDealerId: number | undefined;

  playersForPreHand: SelectableValue<Player>[];
  firstPreHandId: number | undefined;

  playersForMiddleHand: SelectableValue<Player>[];
  firstMiddleHandId: number | undefined;

  playersForRearHand: SelectableValue<Player>[];
  firstRearHandId: number | undefined;

  createdSession: Session | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  private updateRuleSets(): void {
    this.apiService.getRuleSets()
      .subscribe((rss) => this.ruleSets = this.getSelectableRuleSets(rss));
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((g) => {
          this.group = g;

          this.ruleSetId = this.group.defaultRuleSet ? this.group.defaultRuleSet.id : null;

          this.updateRuleSets();

          this.playersForDealer = this.group.players
            .map((p) => toSelectableValue(p, p.name/*, this.firstDealerId === p.id*/));
        });
    });
  }

  getSelectableRuleSets(ruleSets: RuleSet[]): SelectableValue<RuleSet>[] {
    return ruleSets.map((rs) => toSelectableValue(
      rs, rs.name,
//      this.group.default_rule_set && rs.id === this.group.default_rule_set.id,
      JSON.stringify(rs, null, 2)
    ));
  }

  updateDealer(dealerId: number): void {
    console.info(dealerId);

    this.firstDealerId = dealerId;
    this.playersForPreHand = this.group.players
      .filter((p) => p.id !== this.firstDealerId)
      .map((p) => toSelectableValue(p, p.name/*, this.firstPreHandId === p.id*/));
  }

  updatePreHand(preHandId: number): void {
    this.firstPreHandId = preHandId;

    const selectedPlayerIds = [this.firstDealerId, this.firstPreHandId];

    this.playersForMiddleHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.id))
      .map((p) => toSelectableValue(p, p.name/*, this.firstMiddleHandId === p.id*/));
  }


  updateMiddleHand(middleHandId: number): void {
    this.firstMiddleHandId = middleHandId;

    const selectedPlayerIds = [this.firstDealerId, this.firstPreHandId, this.firstMiddleHandId];

    this.playersForRearHand = this.group.players
      .filter((p) => !selectedPlayerIds.includes(p.id))
      .map((p) => toSelectableValue(p, p.name/*, this.firstRearHandId === p.id*/));
  }

  updateRearHand(rearHandId: number): void {
    this.firstRearHandId = rearHandId;
  }

  createSession(): void {
    this.submitted = true;

    if (!this.ruleSetId || !this.firstDealerId || !this.firstPreHandId || !this.firstMiddleHandId || !this.firstRearHandId) {
      alert('You have to select a rule set and a player for every position!');
      return;
    }

    const today = new Date();

    const cs: CreatableSession = {
      ruleSetId: this.ruleSetId,
      date: `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`,
      firstPlayerId: this.firstDealerId,
      secondPlayerId: this.firstPreHandId,
      thirdPlayerId: this.firstMiddleHandId,
      fourthPlayerId: this.firstRearHandId
    };

    this.apiService.createSession(this.group.id, cs)
      .subscribe((session) => this.createdSession = session);
  }

}
