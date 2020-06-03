import * as Types from '../_interfaces/graphql-types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

export type GroupQueryVariables = {
  id: Types.Scalars['Int'];
};


export type GroupQuery = (
  { __typename?: 'QueryRoot' }
  & { group?: Types.Maybe<(
    { __typename?: 'Group' }
    & Pick<Types.Group, 'id' | 'name'>
    & { members: Array<(
      { __typename?: 'Player' }
      & Pick<Types.Player, 'abbreviation' | 'name'>
    )>, sessions: Array<(
      { __typename?: 'Session' }
      & Pick<Types.Session, 'id' | 'hasEnded'>
    )> }
  )> }
);

export type GroupListQueryVariables = {};


export type GroupListQuery = (
  { __typename?: 'QueryRoot' }
  & { groups: Array<(
    { __typename?: 'Group' }
    & Pick<Types.Group, 'id' | 'name' | 'playerCount'>
  )> }
);

export type PlayerListQueryVariables = {};


export type PlayerListQuery = (
  { __typename?: 'QueryRoot' }
  & { players: Array<(
    { __typename?: 'Player' }
    & Pick<Types.Player, 'id' | 'abbreviation' | 'name'>
  )> }
);

export type RuleSetListQueryVariables = {};


export type RuleSetListQuery = (
  { __typename?: 'QueryRoot' }
  & { ruleSets: Array<(
    { __typename?: 'RuleSet' }
    & Pick<Types.RuleSet, 'id' | 'basePrice' | 'soloPrice' | 'countLaufende' | 'farbGeierAllowed' | 'farbWenzAllowed' | 'geierAllowed' | 'hochzeitAllowed' | 'laufendePrice' | 'maxLaufendeIncl' | 'minLaufendeIncl' | 'name' | 'ramschAllowed'>
  )> }
);

export type SessionQueryVariables = {
  groupId: Types.Scalars['Int'];
  sessionId: Types.Scalars['Int'];
};


export type SessionQuery = (
  { __typename?: 'QueryRoot' }
  & { group?: Types.Maybe<(
    { __typename?: 'Group' }
    & { session?: Types.Maybe<(
      { __typename?: 'Session' }
      & Pick<Types.Session, 'hasEnded' | 'date'>
      & { games: Array<(
        { __typename?: 'Game' }
        & Pick<Types.Game, 'id'>
      )> }
    )> }
  )> }
);

export type UserCreationMutationVariables = {
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
  passwordRepeat: Types.Scalars['String'];
};


export type UserCreationMutation = (
  { __typename?: 'Mutations' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<Types.User, 'username'>
  ) }
);

export type PlayerCreationMutationVariables = {
  name: Types.Scalars['String'];
  abbreviation: Types.Scalars['String'];
};


export type PlayerCreationMutation = (
  { __typename?: 'Mutations' }
  & { createPlayer: (
    { __typename?: 'Player' }
    & Pick<Types.Player, 'id' | 'name' | 'abbreviation' | 'pictureName'>
  ) }
);

export type GroupCreationMutationVariables = {
  name: Types.Scalars['String'];
  ruleSetId: Types.Scalars['Int'];
};


export type GroupCreationMutation = (
  { __typename?: 'Mutations' }
  & { createGroup: (
    { __typename?: 'Group' }
    & Pick<Types.Group, 'id' | 'name' | 'ruleSetId'>
  ) }
);

export const GroupDocument = gql`
    query Group($id: Int!) {
  group(id: $id) {
    id
    name
    members {
      abbreviation
      name
    }
    sessions {
      id
      hasEnded
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GroupGQL extends Apollo.Query<GroupQuery, GroupQueryVariables> {
    document = GroupDocument;
    
  }
export const GroupListDocument = gql`
    query GroupList {
  groups {
    id
    name
    playerCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GroupListGQL extends Apollo.Query<GroupListQuery, GroupListQueryVariables> {
    document = GroupListDocument;
    
  }
export const PlayerListDocument = gql`
    query PlayerList {
  players {
    id
    abbreviation
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PlayerListGQL extends Apollo.Query<PlayerListQuery, PlayerListQueryVariables> {
    document = PlayerListDocument;
    
  }
export const RuleSetListDocument = gql`
    query RuleSetList {
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
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RuleSetListGQL extends Apollo.Query<RuleSetListQuery, RuleSetListQueryVariables> {
    document = RuleSetListDocument;
    
  }
export const SessionDocument = gql`
    query Session($groupId: Int!, $sessionId: Int!) {
  group(id: $groupId) {
    session(sessionId: $sessionId) {
      hasEnded
      date
      games {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SessionGQL extends Apollo.Query<SessionQuery, SessionQueryVariables> {
    document = SessionDocument;
    
  }
export const UserCreationDocument = gql`
    mutation UserCreation($username: String!, $password: String!, $passwordRepeat: String!) {
  createUser(newUser: {username: $username, password: $password, passwordRepeat: $passwordRepeat}) {
    username
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserCreationGQL extends Apollo.Mutation<UserCreationMutation, UserCreationMutationVariables> {
    document = UserCreationDocument;
    
  }
export const PlayerCreationDocument = gql`
    mutation PlayerCreation($name: String!, $abbreviation: String!) {
  createPlayer(newPlayer: {name: $name, abbreviation: $abbreviation}) {
    id
    name
    abbreviation
    pictureName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PlayerCreationGQL extends Apollo.Mutation<PlayerCreationMutation, PlayerCreationMutationVariables> {
    document = PlayerCreationDocument;
    
  }
export const GroupCreationDocument = gql`
    mutation GroupCreation($name: String!, $ruleSetId: Int!) {
  createGroup(newGroup: {name: $name, ruleSetId: $ruleSetId}) {
    id
    name
    ruleSetId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GroupCreationGQL extends Apollo.Mutation<GroupCreationMutation, GroupCreationMutationVariables> {
    document = GroupCreationDocument;
    
  }