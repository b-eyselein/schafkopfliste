import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CreatableSession, Group, Player} from "../_interfaces/model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

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

  getPlayers(): Observable<Player[]> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.get<Player[]>(url);
  }

  createPlayer(player: Player): Observable<Player> {
    const url = `${this.baseUrl}/api/players`;

    return this.httpClient.put<Player>(url, player, ApiService.putHttpOptions);
  }

  createSession(session: CreatableSession): Observable<string> {
    const url = `${this.baseUrl}/api/sessions`;

    return this.httpClient.put<string>(url, session, ApiService.putHttpOptions);
  }

}
