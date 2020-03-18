import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface Session {
  id: number;
}

export interface Response {
  group: any;
  sessions: Session[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupGqlService extends Query<Response> {

  document = gql`query GroupQuery($id: Int!) {
    group(id: $id) {
      id
      name
      members {
        abbreviation
        name
      }
      sessions {
        id
      }
    }
  }`;

}
