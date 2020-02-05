import {Injectable} from '@angular/core';
import Dexie from 'dexie';
import {Player, Session} from '../_interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {

  players: Dexie.Table<Player, string>;
  sessions: Dexie.Table<Session, string>;

  constructor() {
    super('SchafkopfListe');

    this.version(1).stores({
      players: 'abbreviation',
      sessions: 'uuid'
    });

    this.players = this.table('players');
    this.sessions = this.table('sessions');
  }
}
