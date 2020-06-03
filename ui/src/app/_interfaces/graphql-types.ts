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
  session?: Maybe<Session>;
};


export type GroupSessionArgs = {
  sessionId: Scalars['Int'];
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
