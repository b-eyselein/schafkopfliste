import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {Group} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {Player} from '../_interfaces/player';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit, OnChanges {

  group: Group;
  players: Player[];

  memberIds: number[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  private updateMembersIds(): void {
    this.memberIds = this.players ? this.players.map((p) => p.id) : [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayers(groupId)
        .subscribe((groupWithPlayers) => {
          this.group = groupWithPlayers.group;
          this.players = groupWithPlayers.players;

          this.updateMembersIds();
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMembersIds();
  }

  onPlayerAdded(player: Player): void {
    this.players.push(player);
  }

}
