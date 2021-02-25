import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  endSession(groupName: string, sessionId: number): Observable<boolean> {
    const url = `${this.baseUrl}/groups/${groupName}/sessions/${sessionId}`;

    return this.httpClient.put<boolean>(url, {}, ApiService.putHttpOptions);
  }

}
