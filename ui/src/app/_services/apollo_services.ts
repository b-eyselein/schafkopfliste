import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export enum CountLaufende {
  Always = 'ALWAYS',
  OnlyLosers = 'ONLY_LOSERS',
  Never = 'NEVER'
}

export type Game = {
   __typename?: 'Game';
  id: Scalars['Int'];
};

export type Group = {
   __typename?: 'Group';
  id: Scalars['Int'];
  name: Scalars['String'];
  ruleSetId: Scalars['Int'];
  ruleSet?: Maybe<RuleSet>;
  playerCount: Scalars['Int'];
  members: Array<Player>;
  sessions: Array<Session>;
};

export type Mutations = {
   __typename?: 'Mutations';
  createUser: User;
  createGroup: Group;
  createPlayer: Player;
};


export type MutationsCreateUserArgs = {
  newUser: NewUser;
};


export type MutationsCreateGroupArgs = {
  newGroup: NewGroup;
};


export type MutationsCreatePlayerArgs = {
  newPlayer: NewPlayer;
};

export type NewGroup = {
  name: Scalars['String'];
  ruleSetId: Scalars['Int'];
};

export type NewPlayer = {
  abbreviation: Scalars['String'];
  name: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
};

export type NewUser = {
  username: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};

export type Player = {
   __typename?: 'Player';
  id: Scalars['Int'];
  abbreviation: Scalars['String'];
  name: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
};

export type QueryRoot = {
   __typename?: 'QueryRoot';
  ruleSets: Array<RuleSet>;
  ruleSet?: Maybe<RuleSet>;
  players: Array<Player>;
  groups: Array<Group>;
  group?: Maybe<Group>;
  session?: Maybe<Session>;
};


export type QueryRootRuleSetArgs = {
  id: Scalars['Int'];
};


export type QueryRootGroupArgs = {
  id: Scalars['Int'];
};


export type QueryRootSessionArgs = {
  id: Scalars['Int'];
  groupId: Scalars['Int'];
};

export type RuleSet = {
   __typename?: 'RuleSet';
  id: Scalars['Int'];
  name: Scalars['String'];
  basePrice: Scalars['Int'];
  soloPrice: Scalars['Int'];
  countLaufende: CountLaufende;
  minLaufendeIncl: Scalars['Int'];
  maxLaufendeIncl: Scalars['Int'];
  laufendePrice: Scalars['Int'];
  geierAllowed: Scalars['Boolean'];
  hochzeitAllowed: Scalars['Boolean'];
  bettelAllowed: Scalars['Boolean'];
  ramschAllowed: Scalars['Boolean'];
  farbWenzAllowed: Scalars['Boolean'];
  farbGeierAllowed: Scalars['Boolean'];
};

export type Session = {
   __typename?: 'Session';
  id: Scalars['Int'];
  hasEnded: Scalars['Boolean'];
  date: Scalars['String'];
  games: Array<Game>;
};

export type User = {
   __typename?: 'User';
  username: Scalars['String'];
  isAdmin: Scalars['Boolean'];
};

export type GroupQueryVariables = {
  id: Scalars['Int'];
};


export type GroupQuery = (
  { __typename?: 'QueryRoot' }
  & { group?: Maybe<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name'>
    & { members: Array<(
      { __typename?: 'Player' }
      & Pick<Player, 'abbreviation' | 'name'>
    )>, sessions: Array<(
      { __typename?: 'Session' }
      & Pick<Session, 'id' | 'hasEnded'>
    )> }
  )> }
);

export type GroupListQueryVariables = {};


export type GroupListQuery = (
  { __typename?: 'QueryRoot' }
  & { groups: Array<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'playerCount'>
  )> }
);

export type PlayerListQueryVariables = {};


export type PlayerListQuery = (
  { __typename?: 'QueryRoot' }
  & { players: Array<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'abbreviation' | 'name'>
  )> }
);

export type RuleSetListQueryVariables = {};


export type RuleSetListQuery = (
  { __typename?: 'QueryRoot' }
  & { ruleSets: Array<(
    { __typename?: 'RuleSet' }
    & Pick<RuleSet, 'id' | 'basePrice' | 'soloPrice' | 'countLaufende' | 'farbGeierAllowed' | 'farbWenzAllowed' | 'geierAllowed' | 'hochzeitAllowed' | 'laufendePrice' | 'maxLaufendeIncl' | 'minLaufendeIncl' | 'name' | 'ramschAllowed'>
  )> }
);

export type UserCreationMutationVariables = {
  username: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};


export type UserCreationMutation = (
  { __typename?: 'Mutations' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'username'>
  ) }
);

export type PlayerCreationMutationVariables = {
  name: Scalars['String'];
  abbreviation: Scalars['String'];
};


export type PlayerCreationMutation = (
  { __typename?: 'Mutations' }
  & { createPlayer: (
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'name' | 'abbreviation' | 'pictureName'>
  ) }
);

export type GroupCreationMutationVariables = {
  name: Scalars['String'];
  ruleSetId: Scalars['Int'];
};


export type GroupCreationMutation = (
  { __typename?: 'Mutations' }
  & { createGroup: (
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'ruleSetId'>
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