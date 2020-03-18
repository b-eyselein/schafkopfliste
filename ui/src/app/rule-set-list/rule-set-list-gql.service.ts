import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {CountLaufende} from '../_interfaces/interfaces';

export interface RuleSet {
  basePrice: number;
  bettelAllowed: boolean;
  countLaufende: CountLaufende;
  farbGeierAllowed: boolean;
  farbWenzAllowed: boolean;
  geierAllowed: boolean;
  hochzeitAllowed: boolean;
  id: number;
  laufendePrice: number;
  maxLaufendeIncl: number;
  minLaufendeIncl: number;
  name: string;
  ramschAllowed: boolean;
  soloPrice: number;
}

export interface Response {
  ruleSets: RuleSet[];
}

@Injectable({
  providedIn: 'root'
})
export class RuleSetListGqlService extends Query<Response> {

  document = gql`{
    ruleSets {
      id
      basePrice
      soloPrice
      countLaufende
      farbGeierAllowed
      farbWenzAllowed
      geierAllowed
      hochzeitAllowed
      id
      laufendePrice
      maxLaufendeIncl
      minLaufendeIncl
      name
      ramschAllowed
      soloPrice
    }
  }`;

}
