import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {Player} from '../_interfaces/player';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit, OnChanges {

  group: GroupWithPlayersAndRuleSet;

  memberIds: number[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  private updateMembersIds(): void {
    this.memberIds = this.group ? this.group.players.map((p) => p.id) : [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((groupWithPlayers) => {
          this.group = groupWithPlayers;

          this.updateMembersIds();
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMembersIds();
  }

  onPlayerAdded(player: Player): void {
    this.group.players.push(player);
  }

}
