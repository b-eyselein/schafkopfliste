import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {
  CompleteSession,
  CreatableGroup,
  CreatablePlayer,
  CreatableSession,
  Game,
  Group,
  GroupWithPlayerMembership,
  Player,
  PricedGame,
  RuleSet,
  Session
} from '../_interfaces/interfaces';
import {GroupWithPlayerCount, GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static putHttpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private readonly baseUrl: string = '/api';

  constructor(private httpClient: HttpClient) {
  }

  getPlayerPicture(playerId): Observable<string | undefined> {
    const url = `assets/player_${playerId}.png`;

    return this.httpClient.get(url, {observe: 'response', responseType: 'blob'})
      .pipe(
        map(() => url),
        catchError(() => of(undefined))
      );
  }

  getGroupsWithPlayerCount(): Observable<GroupWithPlayerCount[]> {
    const url = `${this.baseUrl}/groups/groupsWithPlayerCount`;

    return this.httpClient.get<GroupWithPlayerCount[]>(url);
  }

  getGroupWithPlayersAndRuleSet(groupId: number): Observable<GroupWithPlayersAndRuleSet | undefined> {
    const url = `${this.baseUrl}/groups/${groupId}/groupWithPlayersAndRuleSet`;

    return this.httpClient.get<GroupWithPlayersAndRuleSet | undefined>(url);
  }

  getGroupWithPlayersAndMembership(groupId: number): Observable<GroupWithPlayerMembership | undefined> {
    const url = `${this.baseUrl}/groups/${groupId}/playersAndMembership`;

    return this.httpClient.get<GroupWithPlayerMembership>(url);
  }

  getRuleSets(): Observable<RuleSet[]> {
    const url = `${this.baseUrl}/ruleSets`;

    return this.httpClient.get<RuleSet[]>(url);
  }

  getPlayers(): Observable<Player[]> {
    const url = `${this.baseUrl}/players`;

    return this.httpClient.get<Player[]>(url);
  }

  getSessions(groupId: number): Observable<Session[]> {
    const url = `${this.baseUrl}/groups/${groupId}/sessions`;

    return this.httpClient.get<Session[]>(url);
  }

  getCompleteSession(groupId: number, serialNumber: number): Observable<CompleteSession | undefined> {
    const url = `${this.baseUrl}/groups/${groupId}/sessions/${serialNumber}/sessionWithPlayersAndRuleSet`;

    return this.httpClient.get<CompleteSession>(url);
  }

  // Creation

  createGroup(group: CreatableGroup): Observable<Group | undefined> {
    const url = `${this.baseUrl}/groups`;

    return this.httpClient.put<Group>(url, group, ApiService.putHttpOptions)
      .pipe(catchError((err: HttpErrorResponse) => {
        console.error('Error while creating group: ' + err.error);
        return of(undefined);
      }));
  }

  createPlayer(player: CreatablePlayer): Observable<Player> {
    const url = `${this.baseUrl}/players`;

    return this.httpClient.put<Player>(url, player, ApiService.putHttpOptions);
  }

  createSession(groupId: number, session: CreatableSession): Observable<Session | undefined> {
    const url = `${this.baseUrl}/groups/${groupId}/sessions`;

    return this.httpClient.put<Session>(url, session, ApiService.putHttpOptions)
      .pipe(catchError((err) => {
        console.error(err);
        return of(undefined);
      }));
  }

  addPlayerToGroup(groupId: number, playerId: number): Observable<boolean> {
    const url = `${this.baseUrl}/groups/${groupId}/players`;

    return this.httpClient.put<boolean>(url, playerId, ApiService.putHttpOptions);
  }

  createGame(groupId: number, sessionId: number, game: Game): Observable<PricedGame> {
    const url = `${this.baseUrl}/groups/${groupId}/sessions/${sessionId}/games`;

    return this.httpClient.put<PricedGame>(url, game, ApiService.putHttpOptions);
  }

  endSession(groupId: number, sessionId: number): Observable<boolean> {
    const url = `${this.baseUrl}/groups/${groupId}/sessions/${sessionId}`;

    return this.httpClient.put<boolean>(url, {}, ApiService.putHttpOptions);
  }

}
