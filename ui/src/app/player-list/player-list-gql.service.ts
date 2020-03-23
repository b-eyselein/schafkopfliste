import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface Player {
  id: number;
  abbreviation: string;
  name: string;
}

export interface Response {
  players: Player[];
}

@Injectable({
  providedIn: 'root'
})
export class PlayerListGqlService extends Query<Response> {

  document = gql`{
    players {
      id
      abbreviation
      name
    }
  }`;

}
