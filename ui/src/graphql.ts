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
  /** NaiveDate */
  NaiveDate: any;
  /** NaiveTime */
  NaiveTime: any;
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
  id: Scalars['Int'];
  name: Scalars['String'];
  playerCount: Scalars['Int'];
  players: Array<Player>;
  ruleSet?: Maybe<RuleSet>;
  ruleSets: Array<RuleSet>;
  session?: Maybe<Session>;
  sessions: Array<Session>;
};


export type GroupRuleSetArgs = {
  name: Scalars['String'];
};


export type GroupSessionArgs = {
  id: Scalars['Int'];
};

export type GroupMutations = {
  __typename?: 'GroupMutations';
  createPlayer: Scalars['String'];
  createRuleSet: Scalars['String'];
  newSession: Scalars['Int'];
  session: SessionMutations;
};


export type GroupMutationsCreatePlayerArgs = {
  newPlayer: PlayerInput;
};


export type GroupMutationsCreateRuleSetArgs = {
  ruleSetInput: RuleSetInput;
};


export type GroupMutationsNewSessionArgs = {
  sessionInput: SessionInput;
};


export type GroupMutationsSessionArgs = {
  sessionId: Scalars['Int'];
};

export enum KontraType {
  Kontra = 'KONTRA',
  Re = 'RE',
  Resupra = 'RESUPRA',
  Supra = 'SUPRA'
}

export type Mutations = {
  __typename?: 'Mutations';
  createGroup: Scalars['Int'];
  group: GroupMutations;
  login: UserWithToken;
  registerUser: Scalars['String'];
};


export type MutationsCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationsGroupArgs = {
  groupId: Scalars['Int'];
};


export type MutationsLoginArgs = {
  credentials: Credentials;
};


export type MutationsRegisterUserArgs = {
  registerUserInput: RegisterUserInput;
};

export type Player = {
  __typename?: 'Player';
  balance: Scalars['Int'];
  firstName: Scalars['String'];
  gameCount: Scalars['Int'];
  lastName: Scalars['String'];
  nickname: Scalars['String'];
  playedGames: Scalars['Int'];
  putCount: Scalars['Int'];
  winCount: Scalars['Int'];
};

export type PlayerInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  nickname: Scalars['String'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  group: Group;
  groups: Array<Group>;
  maybeGroup?: Maybe<Group>;
  myGroups: Array<Group>;
};


export type QueryRootGroupArgs = {
  groupId: Scalars['Int'];
};


export type QueryRootMaybeGroupArgs = {
  groupId: Scalars['Int'];
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
  groupId: Scalars['Int'];
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
  date: Scalars['NaiveDate'];
  firstPlayerNickname: Scalars['String'];
  fourthPlayerNickname: Scalars['String'];
  ruleSetName: Scalars['String'];
  secondPlayerNickname: Scalars['String'];
  thirdPlayerNickname: Scalars['String'];
  time: Scalars['NaiveTime'];
};

export type SessionMutations = {
  __typename?: 'SessionMutations';
  endSession: Scalars['Boolean'];
  newGame: Game;
};


export type SessionMutationsNewGameArgs = {
  gameInput: GameInput;
};

export type UserWithToken = {
  __typename?: 'UserWithToken';
  token: Scalars['String'];
  username: Scalars['String'];
};

export type RegisterMutationVariables = Exact<{
  registerUserInput: RegisterUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutations', registerUser: string };

export type LoggedInUserFragment = { __typename?: 'UserWithToken', username: string, token: string };

export type LoginMutationVariables = Exact<{
  credentials: Credentials;
}>;


export type LoginMutation = { __typename?: 'Mutations', login: { __typename?: 'UserWithToken', username: string, token: string } };

export type MyGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyGroupsQuery = { __typename?: 'QueryRoot', myGroups: Array<{ __typename?: 'Group', id: number, name: string, playerCount: number }> };

export type GroupCreationMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type GroupCreationMutation = { __typename?: 'Mutations', createGroup: number };

export type GroupBaseQueryVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type GroupBaseQuery = { __typename?: 'QueryRoot', maybeGroup?: { __typename?: 'Group', name: string } | null | undefined };

export type RuleSetFragment = { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean };

export type NewRuleSetMutationVariables = Exact<{
  groupId: Scalars['Int'];
  ruleSetInput: RuleSetInput;
}>;


export type NewRuleSetMutation = { __typename?: 'Mutations', group: { __typename?: 'GroupMutations', createRuleSet: string } };

export type PlayerFragment = { __typename?: 'Player', nickname: string, firstName: string, lastName: string, balance: number, gameCount: number, playedGames: number, putCount: number, winCount: number };

export type PlayerCreationMutationVariables = Exact<{
  groupId: Scalars['Int'];
  playerInput: PlayerInput;
}>;


export type PlayerCreationMutation = { __typename?: 'Mutations', group: { __typename?: 'GroupMutations', createPlayer: string } };

export type GroupQueryVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type GroupQuery = { __typename?: 'QueryRoot', group: { __typename?: 'Group', name: string, ruleSets: Array<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }>, players: Array<{ __typename?: 'Player', nickname: string, firstName: string, lastName: string, balance: number, gameCount: number, playedGames: number, putCount: number, winCount: number }>, sessions: Array<{ __typename?: 'Session', id: number, hasEnded: boolean }> } };

export type NewSessionValuesGroupFragment = { __typename?: 'Group', players: Array<{ __typename?: 'Player', nickname: string, firstName: string, lastName: string }>, ruleSets: Array<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }> };

export type NewSessionValuesQueryVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type NewSessionValuesQuery = { __typename?: 'QueryRoot', group: { __typename?: 'Group', players: Array<{ __typename?: 'Player', nickname: string, firstName: string, lastName: string }>, ruleSets: Array<{ __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }> } };

export type NewSessionMutationVariables = Exact<{
  groupId: Scalars['Int'];
  sessionInput: SessionInput;
}>;


export type NewSessionMutation = { __typename?: 'Mutations', group: { __typename?: 'GroupMutations', newSession: number } };

export type SessionPlayerFragment = { __typename?: 'Player', nickname: string, firstName: string, lastName: string };

export type SessionGameFragment = { __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: BavarianSuit | null | undefined, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: SchneiderSchwarz | null | undefined, playersHavingPutNicknames: Array<string>, kontra?: KontraType | null | undefined, playersHavingWonNicknames: Array<string>, price: number };

export type SessionFragment = { __typename?: 'Session', date: string, hasEnded: boolean, games: Array<{ __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: BavarianSuit | null | undefined, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: SchneiderSchwarz | null | undefined, playersHavingPutNicknames: Array<string>, kontra?: KontraType | null | undefined, playersHavingWonNicknames: Array<string>, price: number }>, ruleSet: { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }, firstPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, secondPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, thirdPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, fourthPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string } };

export type SessionQueryVariables = Exact<{
  groupId: Scalars['Int'];
  sessionId: Scalars['Int'];
}>;


export type SessionQuery = { __typename?: 'QueryRoot', group: { __typename?: 'Group', session?: { __typename?: 'Session', date: string, hasEnded: boolean, games: Array<{ __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: BavarianSuit | null | undefined, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: SchneiderSchwarz | null | undefined, playersHavingPutNicknames: Array<string>, kontra?: KontraType | null | undefined, playersHavingWonNicknames: Array<string>, price: number }>, ruleSet: { __typename?: 'RuleSet', name: string, basePrice: number, soloPrice: number, countLaufende: CountLaufende, minLaufendeIncl: number, maxLaufendeIncl: number, laufendePrice: number, geierAllowed: boolean, hochzeitAllowed: boolean, bettelAllowed: boolean, ramschAllowed: boolean, farbWenzAllowed: boolean, farbGeierAllowed: boolean }, firstPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, secondPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, thirdPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string }, fourthPlayer: { __typename?: 'Player', nickname: string, firstName: string, lastName: string } } | null | undefined } };

export type CreateGameMutationVariables = Exact<{
  groupId: Scalars['Int'];
  sessionId: Scalars['Int'];
  gameInput: GameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutations', group: { __typename?: 'GroupMutations', session: { __typename?: 'SessionMutations', newGame: { __typename?: 'Game', id: number, actingPlayerNickname: string, gameType: GameType, suit?: BavarianSuit | null | undefined, tout: boolean, isDoubled: boolean, laufendeCount: number, schneiderSchwarz?: SchneiderSchwarz | null | undefined, playersHavingPutNicknames: Array<string>, kontra?: KontraType | null | undefined, playersHavingWonNicknames: Array<string>, price: number } } } };

export type EndSessionMutationVariables = Exact<{
  groupId: Scalars['Int'];
  sessionId: Scalars['Int'];
}>;


export type EndSessionMutation = { __typename?: 'Mutations', group: { __typename?: 'GroupMutations', session: { __typename?: 'SessionMutations', endSession: boolean } } };

export const LoggedInUserFragmentDoc = gql`
    fragment LoggedInUser on UserWithToken {
  username
  token
}
    `;
export const PlayerFragmentDoc = gql`
    fragment Player on Player {
  nickname
  firstName
  lastName
  balance
  gameCount
  playedGames
  putCount
  winCount
}
    `;
export const SessionPlayerFragmentDoc = gql`
    fragment SessionPlayer on Player {
  nickname
  firstName
  lastName
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
    ...SessionPlayer
  }
  ruleSets {
    ...RuleSet
  }
}
    ${SessionPlayerFragmentDoc}
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
export const MyGroupsDocument = gql`
    query MyGroups {
  myGroups {
    id
    name
    playerCount
  }
}
    `;

/**
 * __useMyGroupsQuery__
 *
 * To run a query within a React component, call `useMyGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyGroupsQuery(baseOptions?: Apollo.QueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options);
      }
export function useMyGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options);
        }
export type MyGroupsQueryHookResult = ReturnType<typeof useMyGroupsQuery>;
export type MyGroupsLazyQueryHookResult = ReturnType<typeof useMyGroupsLazyQuery>;
export type MyGroupsQueryResult = Apollo.QueryResult<MyGroupsQuery, MyGroupsQueryVariables>;
export const GroupCreationDocument = gql`
    mutation GroupCreation($name: String!) {
  createGroup(name: $name)
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
export const GroupBaseDocument = gql`
    query GroupBase($groupId: Int!) {
  maybeGroup(groupId: $groupId) {
    name
  }
}
    `;

/**
 * __useGroupBaseQuery__
 *
 * To run a query within a React component, call `useGroupBaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupBaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupBaseQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGroupBaseQuery(baseOptions: Apollo.QueryHookOptions<GroupBaseQuery, GroupBaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GroupBaseQuery, GroupBaseQueryVariables>(GroupBaseDocument, options);
      }
export function useGroupBaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupBaseQuery, GroupBaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GroupBaseQuery, GroupBaseQueryVariables>(GroupBaseDocument, options);
        }
export type GroupBaseQueryHookResult = ReturnType<typeof useGroupBaseQuery>;
export type GroupBaseLazyQueryHookResult = ReturnType<typeof useGroupBaseLazyQuery>;
export type GroupBaseQueryResult = Apollo.QueryResult<GroupBaseQuery, GroupBaseQueryVariables>;
export const NewRuleSetDocument = gql`
    mutation NewRuleSet($groupId: Int!, $ruleSetInput: RuleSetInput!) {
  group(groupId: $groupId) {
    createRuleSet(ruleSetInput: $ruleSetInput)
  }
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
 *      groupId: // value for 'groupId'
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
export const PlayerCreationDocument = gql`
    mutation PlayerCreation($groupId: Int!, $playerInput: PlayerInput!) {
  group(groupId: $groupId) {
    createPlayer(newPlayer: $playerInput)
  }
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
 *      groupId: // value for 'groupId'
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
export const GroupDocument = gql`
    query Group($groupId: Int!) {
  group(groupId: $groupId) {
    name
    ruleSets {
      ...RuleSet
    }
    players {
      ...Player
    }
    sessions {
      id
      hasEnded
    }
  }
}
    ${RuleSetFragmentDoc}
${PlayerFragmentDoc}`;

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
 *      groupId: // value for 'groupId'
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
export const NewSessionValuesDocument = gql`
    query NewSessionValues($groupId: Int!) {
  group(groupId: $groupId) {
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
 *      groupId: // value for 'groupId'
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
    mutation NewSession($groupId: Int!, $sessionInput: SessionInput!) {
  group(groupId: $groupId) {
    newSession(sessionInput: $sessionInput)
  }
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
 *      groupId: // value for 'groupId'
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
    query Session($groupId: Int!, $sessionId: Int!) {
  group(groupId: $groupId) {
    session(id: $sessionId) {
      ...Session
    }
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
 *      groupId: // value for 'groupId'
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
    mutation CreateGame($groupId: Int!, $sessionId: Int!, $gameInput: GameInput!) {
  group(groupId: $groupId) {
    session(sessionId: $sessionId) {
      newGame(gameInput: $gameInput) {
        ...SessionGame
      }
    }
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
 *      groupId: // value for 'groupId'
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
    mutation EndSession($groupId: Int!, $sessionId: Int!) {
  group(groupId: $groupId) {
    session(sessionId: $sessionId) {
      endSession
    }
  }
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
 *      groupId: // value for 'groupId'
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