import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PricedGame} from '../_interfaces/interfaces';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SessionGameFragment} from "./apollo_services";

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

  // Creation

  createGame(groupName: string, sessionId: number, game: SessionGameFragment): Observable<PricedGame> {
    const url = `${this.baseUrl}/groups/${groupName}/sessions/${sessionId}/games`;

    return this.httpClient.put<PricedGame>(url, game, ApiService.putHttpOptions);
  }

  endSession(groupName: string, sessionId: number): Observable<boolean> {
    const url = `${this.baseUrl}/groups/${groupName}/sessions/${sessionId}`;

    return this.httpClient.put<boolean>(url, {}, ApiService.putHttpOptions);
  }

  // Admin stuff

  getRecalculatedStatistics(groupId: number): Observable<any | undefined> {
    const url = `${this.baseUrl}/groups/${groupId}/recalculatedStatistics`;

    return this.httpClient.get<any>(url)
      .pipe(catchError((err) => {
        console.error(err.message);
        return of(undefined);
      }));
  }


}
