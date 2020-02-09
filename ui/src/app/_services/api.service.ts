import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {CreatableGroup, Group, GroupWithPlayerCount} from "../_interfaces/group";
import {CreatableSession} from "../_interfaces/model";
import {Player, PlayerToCreate} from "../_interfaces/player";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl: string = environment.serverUrl;

  static putHttpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

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

  getGroup(groupId: number): Observable<Group | undefined> {
    const url = `${this.baseUrl}/api/groups/${groupId}`;

    return this.httpClient.get<Group | undefined>(url);
  }

  getPlayerCountInGroup(groupId: number): Observable<number> {
    const url = `${this.baseUrl}/api/groups/${groupId}/playerCount`;

    return this.httpClient.get<number>(url);
  }

  getPlayers(): Observable<Player[]> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.get<Player[]>(url);
  }

  createGroup(group: CreatableGroup): Observable<Group | undefined> {
    const url = `${this.baseUrl}/api/groups`;

    return this.httpClient.put<Group>(url, group, ApiService.putHttpOptions)
      .pipe(catchError((err: HttpErrorResponse) => {
        console.error("Error while creating group: " + err.error);
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

}
