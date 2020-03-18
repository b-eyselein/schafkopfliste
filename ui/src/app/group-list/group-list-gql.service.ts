import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface BasicGroup {
  id: number;
  name: string;
  playerCount: number;
}

export interface Response {
  groups: BasicGroup[];
}

@Injectable({providedIn: 'root'})
export class GroupListGqlService extends Query<Response> {

  document = gql`{
    groups {
      id
      name
      playerCount
    }
  }`;

}
