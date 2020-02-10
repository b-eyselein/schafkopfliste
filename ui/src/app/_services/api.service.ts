import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {CreatableGroup, Group, GroupWithPlayerCount, GroupWithPlayers} from '../_interfaces/group';
import {CreatableSession} from '../_interfaces/model';
import {Player, PlayerToCreate} from '../_interfaces/player';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {RuleSet} from '../_interfaces/ruleset';

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
    const url = `${this.baseUrl}/api/groupsWithPlayerCount`;

    return this.httpClient.get<GroupWithPlayerCount[]>(url);
  }

  getGroupWithPlayers(groupId: number): Observable<GroupWithPlayers | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}/groupWithPlayers`;

    return this.httpClient.get<GroupWithPlayers | undefined>(url);
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

  getPlayersInGroup(groupId: number): Observable<Player[]> {
    const url = `${this.baseUrl}/api/groups/${groupId}/players`;

    return this.httpClient.get<Player[]>(url);
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

  createPlayer(player: PlayerToCreate): Observable<Player> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.put<Player>(url, player, ApiService.putHttpOptions);
  }

  createSession(session: CreatableSession): Observable<string> {
    const url = `${this.baseUrl}/api/sessions`;

    return this.httpClient.put<string>(url, session, ApiService.putHttpOptions);
  }

  addPlayerToGroup(groupId: number, playerId: number): Observable<boolean> {
    const url = `${this.baseUrl}/api/groups/${groupId}/players`;

    return this.httpClient.put<boolean>(url, playerId, ApiService.putHttpOptions)
      .pipe(tap((added) => console.info(added)));
  }

}
