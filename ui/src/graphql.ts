import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum BavarianSuit {
  Acorns = 'ACORNS',
  Bells = 'BELLS',
  Hearts = 'HEARTS',
  Leaves = 'LEAVES'
}

export enum CountLaufende {
  Always = 'ALWAYS',
  Never = 'NEVER',
  OnlyLosers = 'ONLY_LOSERS'
}

export type Credentials = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  actingPlayerNickname: Scalars['String'];
  gameType: GameType;
  id: Scalars['Int'];
  isDoubled: Scalars['Boolean'];
  kontra?: Maybe<KontraType>;
  laufendeCount: Scalars['Int'];
  playersHavingPutNicknames: Array<Scalars['String']>;
  playersHavingWonNicknames: Array<Scalars['String']>;
  price: Scalars['Int'];
  schneiderSchwarz?: Maybe<SchneiderSchwarz>;
  suit?: Maybe<BavarianSuit>;
  tout: Scalars['Boolean'];
};

export type GameInput = {
  actingPlayerNickname: Scalars['String'];
  gameType: GameType;
  isDoubled: Scalars['Boolean'];
  kontra?: Maybe<KontraType>;
  laufendeCount: Scalars['Int'];
  playersHavingPutNicknames: Array<Scalars['String']>;
  playersHavingWonNicknames: Array<Scalars['String']>;
  schneiderSchwarz?: Maybe<SchneiderSchwarz>;
  suit?: Maybe<BavarianSuit>;
  tout: Scalars['Boolean'];
};

export enum GameType {
  Bettel = 'BETTEL',
  Farbgeier = 'FARBGEIER',
  Farbsolo = 'FARBSOLO',
  Farbwenz = 'FARBWENZ',
  Geier = 'GEIER',
  Hochzeit = 'HOCHZEIT',
  Ramsch = 'RAMSCH',
  Ruf = 'RUF',
  Wenz = 'WENZ'
}

export type Group = {
  __typename?: 'Group';
  name: Scalars['String'];
  playerCount: Scalars['Int'];
  players: Array<PlayerInGroup>;
  ruleSet?: Maybe<RuleSet>;
  ruleSetName: Scalars['String'];
  sessions: Array<Session>;
};

export type GroupInput = {
  name: Scalars['String'];
  ruleSetName: Scalars['String'];
};

export enum KontraType {
  Kontra = 'KONTRA',
  Re = 'RE',
  Resupra = 'RESUPRA',
  Supra = 'SUPRA'
}

export type Mutations = {
  __typename?: 'Mutations';
  addPlayerToGroup: Scalars['Boolean'];
  createGroup: Group;
  createPlayer: Scalars['String'];
  createRuleSet: Scalars['String'];
  endSession: Scalars['Boolean'];
  login?: Maybe<UserWithToken>;
  newGame: Game;
  newSession: Scalars['Int'];
  registerUser: Scalars['String'];
};


export type MutationsAddPlayerToGroupArgs = {
  groupName: Scalars['String'];
  newState: Scalars['Boolean'];
  playerName: Scalars['String'];
};


export type MutationsCreateGroupArgs = {
  groupInput: GroupInput;
};


export type MutationsCreatePlayerArgs = {
  newPlayer: PlayerInput;
};


export type MutationsCreateRuleSetArgs = {
  ruleSetInput: RuleSetInput;
};


export type MutationsEndSessionArgs = {
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
};


export type MutationsLoginArgs = {
  credentials: Credentials;
};


export type MutationsNewGameArgs = {
  gameInput: GameInput;
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
};


export type MutationsNewSessionArgs = {
  groupName: Scalars['String'];
  sessionInput: SessionInput;
};


export type MutationsRegisterUserArgs = {
  registerUserInput: RegisterUserInput;
};

export type Player = {
  __typename?: 'Player';
  firstName: Scalars['String'];
  isMemberInGroup: Scalars['Boolean'];
  lastName: Scalars['String'];
  nickname: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
};


export type PlayerIsMemberInGroupArgs = {
  groupName: Scalars['String'];
};

export type PlayerInGroup = {
  __typename?: 'PlayerInGroup';
  balance: Scalars['Int'];
  gameCount: Scalars['Int'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  playedGames: Scalars['Int'];
  putCount: Scalars['Int'];
  winCount: Scalars['Int'];
};

export type PlayerInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  nickname: Scalars['String'];
  pictureName?: Maybe<Scalars['String']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  group?: Maybe<Group>;
  groups: Array<Group>;
  players: Array<Player>;
  ruleSet?: Maybe<RuleSet>;
  ruleSets: Array<RuleSet>;
  session?: Maybe<Session>;
};


export type QueryRootGroupArgs = {
  name: Scalars['String'];
};


export type QueryRootRuleSetArgs = {
  name: Scalars['String'];
};


export type QueryRootSessionArgs = {
  groupName: Scalars['String'];
  id: Scalars['Int'];
};

export type RegisterUserInput = {
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
  username: Scalars['String'];
};

export type RuleSet = {
  __typename?: 'RuleSet';
  basePrice: Scalars['Int'];
  bettelAllowed: Scalars['Boolean'];
  countLaufende: CountLaufende;
  farbGeierAllowed: Scalars['Boolean'];
  farbWenzAllowed: Scalars['Boolean'];
  geierAllowed: Scalars['Boolean'];
  hochzeitAllowed: Scalars['Boolean'];
  laufendePrice: Scalars['Int'];
  maxLaufendeIncl: Scalars['Int'];
  minLaufendeIncl: Scalars['Int'];
  name: Scalars['String'];
  ramschAllowed: Scalars['Boolean'];
  soloPrice: Scalars['Int'];
};

export type RuleSetInput = {
  basePrice: Scalars['Int'];
  bettelAllowed: Scalars['Boolean'];
  countLaufende: CountLaufende;
  farbGeierAllowed: Scalars['Boolean'];
  farbWenzAllowed: Scalars['Boolean'];
  geierAllowed: Scalars['Boolean'];
  hochzeitAllowed: Scalars['Boolean'];
  laufendePrice: Scalars['Int'];
  maxLaufendeIncl: Scalars['Int'];
  minLaufendeIncl: Scalars['Int'];
  name: Scalars['String'];
  ramschAllowed: Scalars['Boolean'];
  soloPrice: Scalars['Int'];
};

export enum SchneiderSchwarz {
  Schneider = 'SCHNEIDER',
  Schwarz = 'SCHWARZ'
}

export type Session = {
  __typename?: 'Session';
  date: Scalars['String'];
  firstPlayer: Player;
  fourthPlayer: Player;
  games: Array<Game>;
  hasEnded: Scalars['Boolean'];
  id: Scalars['Int'];
  ruleSet: RuleSet;
  secondPlayer: Player;
  thirdPlayer: Player;
};

export type SessionInput = {
  dateDayOfMonth: Scalars['Int'];
  dateMonth: Scalars['Int'];
  dateYear: Scalars['Int'];
  firstPlayerNickname: Scalars['String'];
  fourthPlayerNickname: Scalars['String'];
  secondPlayerNickname: Scalars['String'];
  thirdPlayerNickname: Scalars['String'];
  timeHours: Scalars['Int'];
  timeMinutes: Scalars['Int'];
};

export type UserWithToken = {
  __typename?: 'UserWithToken';
  isAdmin: Scalars['Boolean'];
  playerNickname?: Maybe<Scalars['String']>;
  token: Scalars['String'];
  username: Scalars['String'];
};

export type NewRuleSetMutationVariables = Exact<{
  ruleSetInput: RuleSetInput;
}>;


export type NewRuleSetMutation = { __typename?: 'Mutations', createRuleSet: string };

export type RuleSetFragment = { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean };

export type RuleSetListQueryVariables = Exact<{ [key: string]: never; }>;


export type RuleSetListQuery = { __typename?: 'QueryRoot', ruleSets: Array<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }> };

export type GroupListQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupListQuery = { __typename?: 'QueryRoot', groups: Array<{ __typename?: 'Group', name: string, playerCount: number }> };

export type GroupCreationMutationVariables = Exact<{
  name: Scalars['String'];
  ruleSetName: Scalars['String'];
}>;


export type GroupCreationMutation = { __typename?: 'Mutations', createGroup: { __typename?: 'Group', name: string, ruleSetName: string } };

export type PlayerInGroupFragment = { __typename?: 'PlayerInGroup', nickname: string, name: string, balance: number, gameCount: number, playedGames: number, putCount: number, winCount: number };

export type GroupQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GroupQuery = { __typename?: 'QueryRoot', group?: Maybe<{ __typename?: 'Group', name: string, players: Array<{ __typename?: 'PlayerInGroup', nickname: string, name: string, balance: number, gameCount: number, playedGames: number, putCount: number, winCount: number }>, sessions: Array<{ __typename?: 'Session', id: number, hasEnded: boolean }> }> };

export type PlayersInGroupQueryVariables = Exact<{
  groupName: Scalars['String'];
}>;


export type PlayersInGroupQuery = { __typename?: 'QueryRoot', players: Array<{ __typename?: 'Player', nickname: string, firstName: string, lastName: string, isMemberInGroup: boolean }> };

export type AddPlayerToGroupMutationVariables = Exact<{
  playerName: Scalars['String'];
  groupName: Scalars['String'];
  newState: Scalars['Boolean'];
}>;


export type AddPlayerToGroupMutation = { __typename?: 'Mutations', addPlayerToGroup: boolean };

export type NewSessionPlayerValuesFragment = { __typename?: 'PlayerInGroup', nickname: string, name: string };

export type NewSessionValuesGroupFragment = { __typename?: 'Group', players: Array<{ __typename?: 'PlayerInGroup', nickname: string, name: string }>, ruleSet?: Maybe<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }> };

export type NewSessionValuesQueryVariables = Exact<{
  groupName: Scalars['String'];
}>;


export type NewSessionValuesQuery = { __typename?: 'QueryRoot', group?: Maybe<{ __typename?: 'Group', players: Array<{ __typename?: 'PlayerInGroup', nickname: string, name: string }>, ruleSet?: Maybe<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }> }> };

export type NewSessionMutationVariables = Exact<{
  groupName: Scalars['String'];
  sessionInput: SessionInput;
}>;


export type NewSessionMutation = { __typename?: 'Mutations', newSession: number };

export type SessionPlayerFragment = { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> };

export type SessionGameFragment = { __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: Maybe<BavarianSuit>, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: Maybe<SchneiderSchwarz>, playersHavingPutNicknames: Array<string>, kontra?: Maybe<KontraType>, playersHavingWonNicknames: Array<string>, price: number };

export type SessionFragment = { __typename?: 'Session', date: string, hasEnded: boolean, games: Array<{ __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: Maybe<BavarianSuit>, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: Maybe<SchneiderSchwarz>, playersHavingPutNicknames: Array<string>, kontra?: Maybe<KontraType>, playersHavingWonNicknames: Array<string>, price: number }>, ruleSet: { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }, firstPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, secondPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, thirdPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, fourthPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> } };

export type SessionQueryVariables = Exact<{
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
}>;


export type SessionQuery = { __typename?: 'QueryRoot', session?: Maybe<{ __typename?: 'Session', date: string, hasEnded: boolean, games: Array<{ __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: Maybe<BavarianSuit>, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: Maybe<SchneiderSchwarz>, playersHavingPutNicknames: Array<string>, kontra?: Maybe<KontraType>, playersHavingWonNicknames: Array<string>, price: number }>, ruleSet: { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }, firstPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, secondPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, thirdPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> }, fourthPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string, pictureName?: Maybe<string> } }> };

export type CreateGameMutationVariables = Exact<{
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
  gameInput: GameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutations', newGame: { __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: Maybe<BavarianSuit>, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: Maybe<SchneiderSchwarz>, playersHavingPutNicknames: Array<string>, kontra?: Maybe<KontraType>, playersHavingWonNicknames: Array<string>, price: number } };

export type EndSessionMutationVariables = Exact<{
  groupName: Scalars['String'];
  sessionId: Scalars['Int'];
}>;


export type EndSessionMutation = { __typename?: 'Mutations', endSession: boolean };

export type PlayerListQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerListQuery = { __typename?: 'QueryRoot', players: Array<{ __typename?: 'Player', nickname: string, firstName: string, lastName: string }> };

export type PlayerCreationMutationVariables = Exact<{
  playerInput: PlayerInput;
}>;


export type PlayerCreationMutation = { __typename?: 'Mutations', createPlayer: string };

export type RegisterMutationVariables = Exact<{
  registerUserInput: RegisterUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutations', registerUser: string };

export type LoggedInUserFragment = { __typename?: 'UserWithToken', username: string, token: string, isAdmin: boolean, playerNickname?: Maybe<string> };

export type LoginMutationVariables = Exact<{
  credentials: Credentials;
}>;


export type LoginMutation = { __typename?: 'Mutations', login?: Maybe<{ __typename?: 'UserWithToken', username: string, token: string, isAdmin: boolean, playerNickname?: Maybe<string> }> };

export const PlayerInGroupFragmentDoc = gql`
    fragment PlayerInGroup on PlayerInGroup {
  nickname
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
  nickname
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
  actingPlayerNickname
  gameType
  suit
  tout
  isDoubled
  laufendeCount
  schneiderSchwarz
  playersHavingPutNicknames
  kontra
  playersHavingWonNicknames
  price
}
    `;
export const SessionPlayerFragmentDoc = gql`
    fragment SessionPlayer on Player {
  nickname
  firstName
  lastName
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
  playerNickname
}
    `;
export const NewRuleSetDocument = gql`
    mutation NewRuleSet($ruleSetInput: RuleSetInput!) {
  createRuleSet(ruleSetInput: $ruleSetInput)
}
    `;
export type NewRuleSetMutationFn = Apollo.MutationFunction<NewRuleSetMutation, NewRuleSetMutationVariables>;

/**
 * __useNewRuleSetMutation__
 *
 * To run a mutation, you first call `useNewRuleSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewRuleSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newRuleSetMutation, { data, loading, error }] = useNewRuleSetMutation({
 *   variables: {
 *      ruleSetInput: // value for 'ruleSetInput'
 *   },
 * });
 */
export function useNewRuleSetMutation(baseOptions?: Apollo.MutationHookOptions<NewRuleSetMutation, NewRuleSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NewRuleSetMutation, NewRuleSetMutationVariables>(NewRuleSetDocument, options);
      }
export type NewRuleSetMutationHookResult = ReturnType<typeof useNewRuleSetMutation>;
export type NewRuleSetMutationResult = Apollo.MutationResult<NewRuleSetMutation>;
export type NewRuleSetMutationOptions = Apollo.BaseMutationOptions<NewRuleSetMutation, NewRuleSetMutationVariables>;
export const RuleSetListDocument = gql`
    query RuleSetList {
  ruleSets {
    ...RuleSet
  }
}
    ${RuleSetFragmentDoc}`;

/**
 * __useRuleSetListQuery__
 *
 * To run a query within a React component, call `useRuleSetListQuery` and pass it any options that fit your needs.
 * When your component renders, `useRuleSetListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRuleSetListQuery({
 *   variables: {
 *   },
 * });
 */
export function useRuleSetListQuery(baseOptions?: Apollo.QueryHookOptions<RuleSetListQuery, RuleSetListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RuleSetListQuery, RuleSetListQueryVariables>(RuleSetListDocument, options);
      }
export function useRuleSetListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RuleSetListQuery, RuleSetListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RuleSetListQuery, RuleSetListQueryVariables>(RuleSetListDocument, options);
        }
export type RuleSetListQueryHookResult = ReturnType<typeof useRuleSetListQuery>;
export type RuleSetListLazyQueryHookResult = ReturnType<typeof useRuleSetListLazyQuery>;
export type RuleSetListQueryResult = Apollo.QueryResult<RuleSetListQuery, RuleSetListQueryVariables>;
export const GroupListDocument = gql`
    query GroupList {
  groups {
    name
    playerCount
  }
}
    `;

/**
 * __useGroupListQuery__
 *
 * To run a query within a React component, call `useGroupListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupListQuery(baseOptions?: Apollo.QueryHookOptions<GroupListQuery, GroupListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GroupListQuery, GroupListQueryVariables>(GroupListDocument, options);
      }
export function useGroupListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupListQuery, GroupListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GroupListQuery, GroupListQueryVariables>(GroupListDocument, options);
        }
export type GroupListQueryHookResult = ReturnType<typeof useGroupListQuery>;
export type GroupListLazyQueryHookResult = ReturnType<typeof useGroupListLazyQuery>;
export type GroupListQueryResult = Apollo.QueryResult<GroupListQuery, GroupListQueryVariables>;
export const GroupCreationDocument = gql`
    mutation GroupCreation($name: String!, $ruleSetName: String!) {
  createGroup(groupInput: {name: $name, ruleSetName: $ruleSetName}) {
    name
    ruleSetName
  }
}
    `;
export type GroupCreationMutationFn = Apollo.MutationFunction<GroupCreationMutation, GroupCreationMutationVariables>;

/**
 * __useGroupCreationMutation__
 *
 * To run a mutation, you first call `useGroupCreationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGroupCreationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [groupCreationMutation, { data, loading, error }] = useGroupCreationMutation({
 *   variables: {
 *      name: // value for 'name'
 *      ruleSetName: // value for 'ruleSetName'
 *   },
 * });
 */
export function useGroupCreationMutation(baseOptions?: Apollo.MutationHookOptions<GroupCreationMutation, GroupCreationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GroupCreationMutation, GroupCreationMutationVariables>(GroupCreationDocument, options);
      }
export type GroupCreationMutationHookResult = ReturnType<typeof useGroupCreationMutation>;
export type GroupCreationMutationResult = Apollo.MutationResult<GroupCreationMutation>;
export type GroupCreationMutationOptions = Apollo.BaseMutationOptions<GroupCreationMutation, GroupCreationMutationVariables>;
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

/**
 * __useGroupQuery__
 *
 * To run a query within a React component, call `useGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGroupQuery(baseOptions: Apollo.QueryHookOptions<GroupQuery, GroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options);
      }
export function useGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupQuery, GroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options);
        }
export type GroupQueryHookResult = ReturnType<typeof useGroupQuery>;
export type GroupLazyQueryHookResult = ReturnType<typeof useGroupLazyQuery>;
export type GroupQueryResult = Apollo.QueryResult<GroupQuery, GroupQueryVariables>;
export const PlayersInGroupDocument = gql`
    query PlayersInGroup($groupName: String!) {
  players {
    nickname
    firstName
    lastName
    isMemberInGroup(groupName: $groupName)
  }
}
    `;

/**
 * __usePlayersInGroupQuery__
 *
 * To run a query within a React component, call `usePlayersInGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayersInGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayersInGroupQuery({
 *   variables: {
 *      groupName: // value for 'groupName'
 *   },
 * });
 */
export function usePlayersInGroupQuery(baseOptions: Apollo.QueryHookOptions<PlayersInGroupQuery, PlayersInGroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayersInGroupQuery, PlayersInGroupQueryVariables>(PlayersInGroupDocument, options);
      }
export function usePlayersInGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayersInGroupQuery, PlayersInGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayersInGroupQuery, PlayersInGroupQueryVariables>(PlayersInGroupDocument, options);
        }
export type PlayersInGroupQueryHookResult = ReturnType<typeof usePlayersInGroupQuery>;
export type PlayersInGroupLazyQueryHookResult = ReturnType<typeof usePlayersInGroupLazyQuery>;
export type PlayersInGroupQueryResult = Apollo.QueryResult<PlayersInGroupQuery, PlayersInGroupQueryVariables>;
export const AddPlayerToGroupDocument = gql`
    mutation AddPlayerToGroup($playerName: String!, $groupName: String!, $newState: Boolean!) {
  addPlayerToGroup(
    playerName: $playerName
    groupName: $groupName
    newState: $newState
  )
}
    `;
export type AddPlayerToGroupMutationFn = Apollo.MutationFunction<AddPlayerToGroupMutation, AddPlayerToGroupMutationVariables>;

/**
 * __useAddPlayerToGroupMutation__
 *
 * To run a mutation, you first call `useAddPlayerToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPlayerToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPlayerToGroupMutation, { data, loading, error }] = useAddPlayerToGroupMutation({
 *   variables: {
 *      playerName: // value for 'playerName'
 *      groupName: // value for 'groupName'
 *      newState: // value for 'newState'
 *   },
 * });
 */
export function useAddPlayerToGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddPlayerToGroupMutation, AddPlayerToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPlayerToGroupMutation, AddPlayerToGroupMutationVariables>(AddPlayerToGroupDocument, options);
      }
export type AddPlayerToGroupMutationHookResult = ReturnType<typeof useAddPlayerToGroupMutation>;
export type AddPlayerToGroupMutationResult = Apollo.MutationResult<AddPlayerToGroupMutation>;
export type AddPlayerToGroupMutationOptions = Apollo.BaseMutationOptions<AddPlayerToGroupMutation, AddPlayerToGroupMutationVariables>;
export const NewSessionValuesDocument = gql`
    query NewSessionValues($groupName: String!) {
  group(name: $groupName) {
    ...NewSessionValuesGroup
  }
}
    ${NewSessionValuesGroupFragmentDoc}`;

/**
 * __useNewSessionValuesQuery__
 *
 * To run a query within a React component, call `useNewSessionValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewSessionValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewSessionValuesQuery({
 *   variables: {
 *      groupName: // value for 'groupName'
 *   },
 * });
 */
export function useNewSessionValuesQuery(baseOptions: Apollo.QueryHookOptions<NewSessionValuesQuery, NewSessionValuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewSessionValuesQuery, NewSessionValuesQueryVariables>(NewSessionValuesDocument, options);
      }
export function useNewSessionValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewSessionValuesQuery, NewSessionValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewSessionValuesQuery, NewSessionValuesQueryVariables>(NewSessionValuesDocument, options);
        }
export type NewSessionValuesQueryHookResult = ReturnType<typeof useNewSessionValuesQuery>;
export type NewSessionValuesLazyQueryHookResult = ReturnType<typeof useNewSessionValuesLazyQuery>;
export type NewSessionValuesQueryResult = Apollo.QueryResult<NewSessionValuesQuery, NewSessionValuesQueryVariables>;
export const NewSessionDocument = gql`
    mutation NewSession($groupName: String!, $sessionInput: SessionInput!) {
  newSession(groupName: $groupName, sessionInput: $sessionInput)
}
    `;
export type NewSessionMutationFn = Apollo.MutationFunction<NewSessionMutation, NewSessionMutationVariables>;

/**
 * __useNewSessionMutation__
 *
 * To run a mutation, you first call `useNewSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newSessionMutation, { data, loading, error }] = useNewSessionMutation({
 *   variables: {
 *      groupName: // value for 'groupName'
 *      sessionInput: // value for 'sessionInput'
 *   },
 * });
 */
export function useNewSessionMutation(baseOptions?: Apollo.MutationHookOptions<NewSessionMutation, NewSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NewSessionMutation, NewSessionMutationVariables>(NewSessionDocument, options);
      }
export type NewSessionMutationHookResult = ReturnType<typeof useNewSessionMutation>;
export type NewSessionMutationResult = Apollo.MutationResult<NewSessionMutation>;
export type NewSessionMutationOptions = Apollo.BaseMutationOptions<NewSessionMutation, NewSessionMutationVariables>;
export const SessionDocument = gql`
    query Session($groupName: String!, $sessionId: Int!) {
  session(groupName: $groupName, id: $sessionId) {
    ...Session
  }
}
    ${SessionFragmentDoc}`;

/**
 * __useSessionQuery__
 *
 * To run a query within a React component, call `useSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionQuery({
 *   variables: {
 *      groupName: // value for 'groupName'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useSessionQuery(baseOptions: Apollo.QueryHookOptions<SessionQuery, SessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SessionQuery, SessionQueryVariables>(SessionDocument, options);
      }
export function useSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionQuery, SessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SessionQuery, SessionQueryVariables>(SessionDocument, options);
        }
export type SessionQueryHookResult = ReturnType<typeof useSessionQuery>;
export type SessionLazyQueryHookResult = ReturnType<typeof useSessionLazyQuery>;
export type SessionQueryResult = Apollo.QueryResult<SessionQuery, SessionQueryVariables>;
export const CreateGameDocument = gql`
    mutation CreateGame($groupName: String!, $sessionId: Int!, $gameInput: GameInput!) {
  newGame(groupName: $groupName, sessionId: $sessionId, gameInput: $gameInput) {
    ...SessionGame
  }
}
    ${SessionGameFragmentDoc}`;
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      groupName: // value for 'groupName'
 *      sessionId: // value for 'sessionId'
 *      gameInput: // value for 'gameInput'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const EndSessionDocument = gql`
    mutation EndSession($groupName: String!, $sessionId: Int!) {
  endSession(groupName: $groupName, sessionId: $sessionId)
}
    `;
export type EndSessionMutationFn = Apollo.MutationFunction<EndSessionMutation, EndSessionMutationVariables>;

/**
 * __useEndSessionMutation__
 *
 * To run a mutation, you first call `useEndSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endSessionMutation, { data, loading, error }] = useEndSessionMutation({
 *   variables: {
 *      groupName: // value for 'groupName'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useEndSessionMutation(baseOptions?: Apollo.MutationHookOptions<EndSessionMutation, EndSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EndSessionMutation, EndSessionMutationVariables>(EndSessionDocument, options);
      }
export type EndSessionMutationHookResult = ReturnType<typeof useEndSessionMutation>;
export type EndSessionMutationResult = Apollo.MutationResult<EndSessionMutation>;
export type EndSessionMutationOptions = Apollo.BaseMutationOptions<EndSessionMutation, EndSessionMutationVariables>;
export const PlayerListDocument = gql`
    query PlayerList {
  players {
    nickname
    firstName
    lastName
  }
}
    `;

/**
 * __usePlayerListQuery__
 *
 * To run a query within a React component, call `usePlayerListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayerListQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayerListQuery(baseOptions?: Apollo.QueryHookOptions<PlayerListQuery, PlayerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayerListQuery, PlayerListQueryVariables>(PlayerListDocument, options);
      }
export function usePlayerListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayerListQuery, PlayerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayerListQuery, PlayerListQueryVariables>(PlayerListDocument, options);
        }
export type PlayerListQueryHookResult = ReturnType<typeof usePlayerListQuery>;
export type PlayerListLazyQueryHookResult = ReturnType<typeof usePlayerListLazyQuery>;
export type PlayerListQueryResult = Apollo.QueryResult<PlayerListQuery, PlayerListQueryVariables>;
export const PlayerCreationDocument = gql`
    mutation PlayerCreation($playerInput: PlayerInput!) {
  createPlayer(newPlayer: $playerInput)
}
    `;
export type PlayerCreationMutationFn = Apollo.MutationFunction<PlayerCreationMutation, PlayerCreationMutationVariables>;

/**
 * __usePlayerCreationMutation__
 *
 * To run a mutation, you first call `usePlayerCreationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayerCreationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playerCreationMutation, { data, loading, error }] = usePlayerCreationMutation({
 *   variables: {
 *      playerInput: // value for 'playerInput'
 *   },
 * });
 */
export function usePlayerCreationMutation(baseOptions?: Apollo.MutationHookOptions<PlayerCreationMutation, PlayerCreationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlayerCreationMutation, PlayerCreationMutationVariables>(PlayerCreationDocument, options);
      }
export type PlayerCreationMutationHookResult = ReturnType<typeof usePlayerCreationMutation>;
export type PlayerCreationMutationResult = Apollo.MutationResult<PlayerCreationMutation>;
export type PlayerCreationMutationOptions = Apollo.BaseMutationOptions<PlayerCreationMutation, PlayerCreationMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($registerUserInput: RegisterUserInput!) {
  registerUser(registerUserInput: $registerUserInput)
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerUserInput: // value for 'registerUserInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($credentials: Credentials!) {
  login(credentials: $credentials) {
    ...LoggedInUser
  }
}
    ${LoggedInUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      credentials: // value for 'credentials'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;