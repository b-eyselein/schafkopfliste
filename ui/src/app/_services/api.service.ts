import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Player} from "../_interfaces/model";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl: string = environment.serverUrl;

  constructor(private httpClient: HttpClient) {
  }

  getPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${this.baseUrl}/players`)
      .pipe(catchError(() => of([])))
  }

  createPlayer(player: Player): Observable<any> {
    return this.httpClient.put(`/api/players`, player);
  }

}
