import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export enum GameType {
  Ruf = 'RUF',
  Wenz = 'WENZ',
  Farbsolo = 'FARBSOLO',
  Geier = 'GEIER',
  Hochzeit = 'HOCHZEIT',
  Bettel = 'BETTEL',
  Ramsch = 'RAMSCH',
  Farbwenz = 'FARBWENZ',
  Farbgeier = 'FARBGEIER'
}

export enum CountLaufende {
  Always = 'ALWAYS',
  OnlyLosers = 'ONLY_LOSERS',
  Never = 'NEVER'
}

export enum KontraType {
  Kontra = 'KONTRA',
  Re = 'RE',
  Supra = 'SUPRA',
  Resupra = 'RESUPRA'
}

export type PlayerInput = {
  abbreviation: Scalars['String'];
  name: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  name: Scalars['String'];
  ruleSetName: Scalars['String'];
  ruleSet?: Maybe<RuleSet>;
  playerCount: Scalars['Int'];
  players: Array<PlayerInGroup>;
  sessions: Array<Session>;
};

export type GameInput = {
  actingPlayerAbbreviation: Scalars['String'];
  gameType: GameType;
  suit?: Maybe<BavarianSuit>;
  tout: Scalars['Boolean'];
  isDoubled: Scalars['Boolean'];
  laufendeCount: Scalars['Int'];
  schneiderSchwarz?: Maybe<SchneiderSchwarz>;
  playersHavingPutAbbreviations: Array<Scalars['String']>;
  kontra?: Maybe<KontraType>;
  playersHavingWonAbbreviations: Array<Scalars['String']>;
};

export type Mutations = {
  __typename?: 'Mutations';
  registerUser: Scalars['String'];
  login?: Maybe<UserWithToken>;
  createRuleSet: Scalars['String'];
  createGroup: Group;
  createPlayer: Scalars['String'];
  addPlayerToGroup: Scalars['Boolean'];
  newSession: Scalars['Int'];
  newGame: Game;
};


export type MutationsRegisterUserArgs = {
  registerUserInput: RegisterUserInput;
};


export type MutationsLoginArgs = {
  credentials: Credentials;
};


export type MutationsCreateRuleSetArgs = {
  ruleSetInput: RuleSetInput;
};


export type MutationsCreateGroupArgs = {
  groupInput: GroupInput;
};


export type MutationsCreatePlayerArgs = {
  newPlayer: PlayerInput;
};


export type MutationsAddPlayerToGroupArgs = {
  playerName: Scalars['String'];
  groupName: Scalars['String'];
  newState: Scalars['Boolean'];
};


export type MutationsNewSessionArgs = {
  groupName: Scalars['String'];
  sessionInput: SessionInput;
};


export type MutationsNewGameArgs = {
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
  gameInput: GameInput;
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['Int'];
  hasEnded: Scalars['Boolean'];
  date: Scalars['String'];
  games: Array<Game>;
  ruleSet: RuleSet;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  fourthPlayer: Player;
};

export type RegisterUserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
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
  name: Scalars['String'];
};


export type QueryRootGroupArgs = {
  name: Scalars['String'];
};


export type QueryRootSessionArgs = {
  id: Scalars['Int'];
  groupName: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['Int'];
  actingPlayerAbbreviation: Scalars['String'];
  gameType: GameType;
  suit?: Maybe<BavarianSuit>;
  tout: Scalars['Boolean'];
  isDoubled: Scalars['Boolean'];
  laufendeCount: Scalars['Int'];
  schneiderSchwarz?: Maybe<SchneiderSchwarz>;
  playersHavingPutAbbreviations: Array<Scalars['String']>;
  kontra?: Maybe<KontraType>;
  playersHavingWonAbbreviations: Array<Scalars['String']>;
  price: Scalars['Int'];
};

export enum SchneiderSchwarz {
  Schneider = 'SCHNEIDER',
  Schwarz = 'SCHWARZ'
}

export type RuleSet = {
  __typename?: 'RuleSet';
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

export type Credentials = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type RuleSetInput = {
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

export type Player = {
  __typename?: 'Player';
  abbreviation: Scalars['String'];
  name: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
  isMemberInGroup: Scalars['Boolean'];
};


export type PlayerIsMemberInGroupArgs = {
  groupName: Scalars['String'];
};

export type GroupInput = {
  name: Scalars['String'];
  ruleSetName: Scalars['String'];
};

export type PlayerInGroup = {
  __typename?: 'PlayerInGroup';
  abbreviation: Scalars['String'];
  name: Scalars['String'];
  balance: Scalars['Int'];
  gameCount: Scalars['Int'];
  putCount: Scalars['Int'];
  playedGames: Scalars['Int'];
  winCount: Scalars['Int'];
  isActive: Scalars['Boolean'];
};

export type UserWithToken = {
  __typename?: 'UserWithToken';
  username: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  playerAbbreviation?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};

export type SessionInput = {
  dateYear: Scalars['Int'];
  dateMonth: Scalars['Int'];
  dateDayOfMonth: Scalars['Int'];
  timeHours: Scalars['Int'];
  timeMinutes: Scalars['Int'];
  firstPlayerAbbreviation: Scalars['String'];
  secondPlayerAbbreviation: Scalars['String'];
  thirdPlayerAbbreviation: Scalars['String'];
  fourthPlayerAbbreviation: Scalars['String'];
};

export enum BavarianSuit {
  Acorns = 'ACORNS',
  Leaves = 'LEAVES',
  Hearts = 'HEARTS',
  Bells = 'BELLS'
}

export type NewRuleSetMutationVariables = Exact<{
  ruleSetInput: RuleSetInput;
}>;


export type NewRuleSetMutation = (
  { __typename?: 'Mutations' }
  & Pick<Mutations, 'createRuleSet'>
);

export type RuleSetFragment = (
  { __typename?: 'RuleSet' }
  & Pick<RuleSet, 'name' | 'basePrice' | 'soloPrice' | 'countLaufende' | 'minLaufendeIncl' | 'maxLaufendeIncl' | 'laufendePrice' | 'geierAllowed' | 'hochzeitAllowed' | 'bettelAllowed' | 'ramschAllowed' | 'farbWenzAllowed' | 'farbGeierAllowed'>
);

export type RuleSetListQueryVariables = Exact<{ [key: string]: never; }>;


export type RuleSetListQuery = (
  { __typename?: 'QueryRoot' }
  & { ruleSets: Array<(
    { __typename?: 'RuleSet' }
    & RuleSetFragment
  )> }
);

export type GroupListQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupListQuery = (
  { __typename?: 'QueryRoot' }
  & { groups: Array<(
    { __typename?: 'Group' }
    & Pick<Group, 'name' | 'playerCount'>
  )> }
);

export type GroupCreationMutationVariables = Exact<{
  name: Scalars['String'];
  ruleSetName: Scalars['String'];
}>;


export type GroupCreationMutation = (
  { __typename?: 'Mutations' }
  & { createGroup: (
    { __typename?: 'Group' }
    & Pick<Group, 'name' | 'ruleSetName'>
  ) }
);

export type PlayerInGroupFragment = (
  { __typename?: 'PlayerInGroup' }
  & Pick<PlayerInGroup, 'abbreviation' | 'name' | 'balance' | 'gameCount' | 'playedGames' | 'putCount' | 'winCount'>
);

export type GroupQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GroupQuery = (
  { __typename?: 'QueryRoot' }
  & { group?: Maybe<(
    { __typename?: 'Group' }
    & Pick<Group, 'name'>
    & { players: Array<(
      { __typename?: 'PlayerInGroup' }
      & PlayerInGroupFragment
    )>, sessions: Array<(
      { __typename?: 'Session' }
      & Pick<Session, 'id' | 'hasEnded'>
    )> }
  )> }
);

export type PlayersInGroupQueryVariables = Exact<{
  groupName: Scalars['String'];
}>;


export type PlayersInGroupQuery = (
  { __typename?: 'QueryRoot' }
  & { players: Array<(
    { __typename?: 'Player' }
    & Pick<Player, 'abbreviation' | 'name' | 'isMemberInGroup'>
  )> }
);

export type AddPlayerToGroupMutationVariables = Exact<{
  playerName: Scalars['String'];
  groupName: Scalars['String'];
  newState: Scalars['Boolean'];
}>;


export type AddPlayerToGroupMutation = (
  { __typename?: 'Mutations' }
  & Pick<Mutations, 'addPlayerToGroup'>
);

export type NewSessionPlayerValuesFragment = (
  { __typename?: 'PlayerInGroup' }
  & Pick<PlayerInGroup, 'abbreviation' | 'name'>
);

export type NewSessionValuesGroupFragment = (
  { __typename?: 'Group' }
  & { players: Array<(
    { __typename?: 'PlayerInGroup' }
    & NewSessionPlayerValuesFragment
  )>, ruleSet?: Maybe<(
    { __typename?: 'RuleSet' }
    & RuleSetFragment
  )> }
);

export type NewSessionValuesQueryVariables = Exact<{
  groupName: Scalars['String'];
}>;


export type NewSessionValuesQuery = (
  { __typename?: 'QueryRoot' }
  & { group?: Maybe<(
    { __typename?: 'Group' }
    & NewSessionValuesGroupFragment
  )> }
);

export type NewSessionMutationVariables = Exact<{
  groupName: Scalars['String'];
  sessionInput: SessionInput;
}>;


export type NewSessionMutation = (
  { __typename?: 'Mutations' }
  & Pick<Mutations, 'newSession'>
);

export type SessionPlayerFragment = (
  { __typename?: 'Player' }
  & Pick<Player, 'abbreviation' | 'name' | 'pictureName'>
);

export type SessionGameFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'id' | 'actingPlayerAbbreviation' | 'gameType' | 'suit' | 'tout' | 'isDoubled' | 'laufendeCount' | 'schneiderSchwarz' | 'playersHavingPutAbbreviations' | 'kontra' | 'playersHavingWonAbbreviations' | 'price'>
);

export type SessionFragment = (
  { __typename?: 'Session' }
  & Pick<Session, 'date' | 'hasEnded'>
  & { games: Array<(
    { __typename?: 'Game' }
    & SessionGameFragment
  )>, ruleSet: (
    { __typename?: 'RuleSet' }
    & RuleSetFragment
  ), firstPlayer: (
    { __typename?: 'Player' }
    & SessionPlayerFragment
  ), secondPlayer: (
    { __typename?: 'Player' }
    & SessionPlayerFragment
  ), thirdPlayer: (
    { __typename?: 'Player' }
    & SessionPlayerFragment
  ), fourthPlayer: (
    { __typename?: 'Player' }
    & SessionPlayerFragment
  ) }
);

export type SessionQueryVariables = Exact<{
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
}>;


export type SessionQuery = (
  { __typename?: 'QueryRoot' }
  & { session?: Maybe<(
    { __typename?: 'Session' }
    & SessionFragment
  )> }
);

export type CreateGameMutationVariables = Exact<{
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
  gameInput: GameInput;
}>;


export type CreateGameMutation = (
  { __typename?: 'Mutations' }
  & { newGame: (
    { __typename?: 'Game' }
    & SessionGameFragment
  ) }
);

export type PlayerListQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerListQuery = (
  { __typename?: 'QueryRoot' }
  & { players: Array<(
    { __typename?: 'Player' }
    & Pick<Player, 'abbreviation' | 'name'>
  )> }
);

export type PlayerCreationMutationVariables = Exact<{
  name: Scalars['String'];
  abbreviation: Scalars['String'];
}>;


export type PlayerCreationMutation = (
  { __typename?: 'Mutations' }
  & Pick<Mutations, 'createPlayer'>
);

export type RegisterMutationVariables = Exact<{
  registerUserInput: RegisterUserInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutations' }
  & Pick<Mutations, 'registerUser'>
);

export type LoggedInUserFragment = (
  { __typename?: 'UserWithToken' }
  & Pick<UserWithToken, 'username' | 'token' | 'isAdmin' | 'playerAbbreviation'>
);

export type LoginMutationVariables = Exact<{
  credentials: Credentials;
}>;


export type LoginMutation = (
  { __typename?: 'Mutations' }
  & { login?: Maybe<(
    { __typename?: 'UserWithToken' }
    & LoggedInUserFragment
  )> }
);

export const PlayerInGroupFragmentDoc = gql`
    fragment PlayerInGroup on PlayerInGroup {
  abbreviation
  name
  balance
  gameCount
  playedGames
  putCount
  winCount
}
    `;
export const NewSessionPlayerValuesFragmentDoc = gql`
    fragment NewSessionPlayerValues on PlayerInGroup {
  abbreviation
  name
}
    `;
export const RuleSetFragmentDoc = gql`
    fragment RuleSet on RuleSet {
  name
  basePrice
  soloPrice
  countLaufende
  minLaufendeIncl
  maxLaufendeIncl
  laufendePrice
  geierAllowed
  hochzeitAllowed
  bettelAllowed
  ramschAllowed
  farbWenzAllowed
  farbGeierAllowed
}
    `;
export const NewSessionValuesGroupFragmentDoc = gql`
    fragment NewSessionValuesGroup on Group {
  players {
    ...NewSessionPlayerValues
  }
  ruleSet {
    ...RuleSet
  }
}
    ${NewSessionPlayerValuesFragmentDoc}
${RuleSetFragmentDoc}`;
export const SessionGameFragmentDoc = gql`
    fragment SessionGame on Game {
  id
  actingPlayerAbbreviation
  gameType
  suit
  tout
  isDoubled
  laufendeCount
  schneiderSchwarz
  playersHavingPutAbbreviations
  kontra
  playersHavingWonAbbreviations
  price
}
    `;
export const SessionPlayerFragmentDoc = gql`
    fragment SessionPlayer on Player {
  abbreviation
  name
  pictureName
}
    `;
export const SessionFragmentDoc = gql`
    fragment Session on Session {
  date
  games {
    ...SessionGame
  }
  ruleSet {
    ...RuleSet
  }
  firstPlayer {
    ...SessionPlayer
  }
  secondPlayer {
    ...SessionPlayer
  }
  thirdPlayer {
    ...SessionPlayer
  }
  fourthPlayer {
    ...SessionPlayer
  }
  hasEnded
}
    ${SessionGameFragmentDoc}
${RuleSetFragmentDoc}
${SessionPlayerFragmentDoc}`;
export const LoggedInUserFragmentDoc = gql`
    fragment LoggedInUser on UserWithToken {
  username
  token
  isAdmin
  playerAbbreviation
}
    `;
export const NewRuleSetDocument = gql`
    mutation NewRuleSet($ruleSetInput: RuleSetInput!) {
  createRuleSet(ruleSetInput: $ruleSetInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewRuleSetGQL extends Apollo.Mutation<NewRuleSetMutation, NewRuleSetMutationVariables> {
    document = NewRuleSetDocument;
    
  }
export const RuleSetListDocument = gql`
    query RuleSetList {
  ruleSets {
    ...RuleSet
  }
}
    ${RuleSetFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class RuleSetListGQL extends Apollo.Query<RuleSetListQuery, RuleSetListQueryVariables> {
    document = RuleSetListDocument;
    
  }
export const GroupListDocument = gql`
    query GroupList {
  groups {
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
export const GroupCreationDocument = gql`
    mutation GroupCreation($name: String!, $ruleSetName: String!) {
  createGroup(groupInput: {name: $name, ruleSetName: $ruleSetName}) {
    name
    ruleSetName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GroupCreationGQL extends Apollo.Mutation<GroupCreationMutation, GroupCreationMutationVariables> {
    document = GroupCreationDocument;
    
  }
export const GroupDocument = gql`
    query Group($name: String!) {
  group(name: $name) {
    name
    players {
      ...PlayerInGroup
    }
    sessions {
      id
      hasEnded
    }
  }
}
    ${PlayerInGroupFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GroupGQL extends Apollo.Query<GroupQuery, GroupQueryVariables> {
    document = GroupDocument;
    
  }
export const PlayersInGroupDocument = gql`
    query PlayersInGroup($groupName: String!) {
  players {
    abbreviation
    name
    isMemberInGroup(groupName: $groupName)
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PlayersInGroupGQL extends Apollo.Query<PlayersInGroupQuery, PlayersInGroupQueryVariables> {
    document = PlayersInGroupDocument;
    
  }
export const AddPlayerToGroupDocument = gql`
    mutation AddPlayerToGroup($playerName: String!, $groupName: String!, $newState: Boolean!) {
  addPlayerToGroup(
    playerName: $playerName
    groupName: $groupName
    newState: $newState
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddPlayerToGroupGQL extends Apollo.Mutation<AddPlayerToGroupMutation, AddPlayerToGroupMutationVariables> {
    document = AddPlayerToGroupDocument;
    
  }
export const NewSessionValuesDocument = gql`
    query NewSessionValues($groupName: String!) {
  group(name: $groupName) {
    ...NewSessionValuesGroup
  }
}
    ${NewSessionValuesGroupFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class NewSessionValuesGQL extends Apollo.Query<NewSessionValuesQuery, NewSessionValuesQueryVariables> {
    document = NewSessionValuesDocument;
    
  }
export const NewSessionDocument = gql`
    mutation NewSession($groupName: String!, $sessionInput: SessionInput!) {
  newSession(groupName: $groupName, sessionInput: $sessionInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewSessionGQL extends Apollo.Mutation<NewSessionMutation, NewSessionMutationVariables> {
    document = NewSessionDocument;
    
  }
export const SessionDocument = gql`
    query Session($groupName: String!, $sessionId: Int!) {
  session(groupName: $groupName, id: $sessionId) {
    ...Session
  }
}
    ${SessionFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SessionGQL extends Apollo.Query<SessionQuery, SessionQueryVariables> {
    document = SessionDocument;
    
  }
export const CreateGameDocument = gql`
    mutation CreateGame($groupName: String!, $sessionId: Int!, $gameInput: GameInput!) {
  newGame(groupName: $groupName, sessionId: $sessionId, gameInput: $gameInput) {
    ...SessionGame
  }
}
    ${SessionGameFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateGameGQL extends Apollo.Mutation<CreateGameMutation, CreateGameMutationVariables> {
    document = CreateGameDocument;
    
  }
export const PlayerListDocument = gql`
    query PlayerList {
  players {
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
export const PlayerCreationDocument = gql`
    mutation PlayerCreation($name: String!, $abbreviation: String!) {
  createPlayer(newPlayer: {name: $name, abbreviation: $abbreviation})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PlayerCreationGQL extends Apollo.Mutation<PlayerCreationMutation, PlayerCreationMutationVariables> {
    document = PlayerCreationDocument;
    
  }
export const RegisterDocument = gql`
    mutation Register($registerUserInput: RegisterUserInput!) {
  registerUser(registerUserInput: $registerUserInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
  }
export const LoginDocument = gql`
    mutation Login($credentials: Credentials!) {
  login(credentials: $credentials) {
    ...LoggedInUser
  }
}
    ${LoggedInUserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
  }