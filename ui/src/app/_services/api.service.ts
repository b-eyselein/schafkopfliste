import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {CreatableGroup, CreatablePlayer, Group, Player, RuleSet} from '../_interfaces/interfaces';
import {GroupWithPlayerCount, GroupWithPlayersAndMembership, GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {CompleteSession, CreatableSession, Session} from '../_interfaces/model';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Game} from '../_interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static putHttpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private readonly baseUrl: string = environment.serverUrl;

  constructor(private httpClient: HttpClient) {
  }

  getGroups(): Observable<Group[]> {
    const url = `${this.baseUrl}/api/groups`;

    return this.httpClient.get<Group[]>(url);
  }

  getGroupsWithPlayerCount(): Observable<GroupWithPlayerCount[]> {
    const url = `${this.baseUrl}/api/groups/groupsWithPlayerCount`;

    return this.httpClient.get<GroupWithPlayerCount[]>(url);
  }

  getGroupWithPlayersAndRuleSet(groupId: number): Observable<GroupWithPlayersAndRuleSet | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}/groupWithPlayersAndRuleSet`;

    return this.httpClient.get<GroupWithPlayersAndRuleSet | undefined>(url);
  }

  getGroupWithPlayersAndMembership(groupId: number): Observable<GroupWithPlayersAndMembership | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}/playersAndMembership`;

    return this.httpClient.get<GroupWithPlayersAndMembership>(url);
  }

  getGroup(groupId: number): Observable<Group | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}`;

    return this.httpClient.get<Group | undefined>(url);
  }

  getRuleSets(): Observable<RuleSet[]> {
    const url = `${this.baseUrl}/api/ruleSets`;

    return this.httpClient.get<RuleSet[]>(url);
  }

  getPlayers(): Observable<Player[]> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.get<Player[]>(url);
  }

  getSession(groupId: number, serialNumber: number): Observable<Session | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}/sessions/${serialNumber}`;

    return this.httpClient.get<Session>(url);
  }

  getSessions(groupId: number): Observable<Session[]> {
    const url = `${this.baseUrl}/api/groups/${groupId}/sessions`;

    return this.httpClient.get<Session[]>(url);
  }

  getCompleteSession(groupId: number, serialNumber: number): Observable<CompleteSession | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}/sessions/${serialNumber}/sessionWithPlayersAndRuleSet`;

    return this.httpClient.get<CompleteSession>(url);
  }

  // Creation

  createGroup(group: CreatableGroup): Observable<Group | undefined> {
    const url = `${this.baseUrl}/api/groups`;

    return this.httpClient.put<Group>(url, group, ApiService.putHttpOptions)
      .pipe(catchError((err: HttpErrorResponse) => {
        console.error('Error while creating group: ' + err.error);
        return of(undefined);
      }));
  }

  createPlayer(player: CreatablePlayer): Observable<Player> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.put<Player>(url, player, ApiService.putHttpOptions);
  }

  createSession(groupId: number, session: CreatableSession): Observable<Session> {
    const url = `${this.baseUrl}/api/groups/${groupId}/sessions`;

    return this.httpClient.put<Session>(url, session, ApiService.putHttpOptions);
  }

  addPlayerToGroup(groupId: number, playerId: number): Observable<boolean> {
    const url = `${this.baseUrl}/api/groups/${groupId}/players`;

    return this.httpClient.put<boolean>(url, playerId, ApiService.putHttpOptions);
  }

  createGame(groupId: number, sessionSerialNumber: number, game: Game): Observable<Game> {
    const url = `${this.baseUrl}/api/groups/${groupId}/sessions/${sessionSerialNumber}/games`;

    return this.httpClient.put<Game>(url, game, ApiService.putHttpOptions);
  }

}
