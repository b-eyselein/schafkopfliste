import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Player} from '../../_interfaces/player';
import {ApiService} from '../../_services/api.service';

@Component({
  selector: 'skl-add-player-to-group',
  templateUrl: './add-player-to-group.component.html'
})
export class AddPlayerToGroupComponent implements OnInit, OnChanges {

  @Input() groupId: number;
  @Input() memberIds: number[];

  allPlayers: Player[] = [];

  players: Player[];

  @Output() playerAdded = new EventEmitter<Player>();

  constructor(private apiService: ApiService) {
  }

  private updatePlayers(): void {
    const memIds = this.memberIds ? this.memberIds : [];

    this.players = this.allPlayers.filter((p) => !memIds.includes(p.id));
  }

  ngOnInit(): void {
    this.apiService.getPlayers()
      .subscribe((players) => {
        this.allPlayers = players;
        this.updatePlayers();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePlayers();
  }

  addPlayerToGroup(player: Player): void {
    this.apiService.addPlayerToGroup(this.groupId, player.id)
      .subscribe((added) => {
        if (added) {
          this.players = this.players.filter((p) => p !== player);
          this.memberIds.push(player.id);

          this.playerAdded.emit(player);
        }
      });
  }

}
